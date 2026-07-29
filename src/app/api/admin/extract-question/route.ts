import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;
export const runtime = 'nodejs';

// ─── Grok (xAI) ───────────────────────────────────────────────
async function callGrok(dataUrl: string): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('NO_XAI_API_KEY');

  const body = {
    model: 'grok-2-vision-2024-10-22',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: EXTRACT_PROMPT },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 8000,
  };

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errTxt = await res.text().catch(() => '');
    throw new Error(`Grok HTTP ${res.status}: ${errTxt.substring(0, 200)}`);
  }

  const data: any = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

// ─── z-ai-web-dev-sdk VLM fallback ──────────────────────────────
async function callZaiVLM(dataUrl: string): Promise<string> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();
  const response: any = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: EXTRACT_PROMPT },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    thinking: { type: 'disabled' },
  });
  return response?.choices?.[0]?.message?.content || '';
}

// ─── Prompt ─────────────────────────────────────────────────────
const EXTRACT_PROMPT = `You are an expert exam paper OCR scanner. This image contains MULTIPLE MCQ questions from a competitive exam paper.

CRITICAL: Extract EVERY single question visible in the image. Do NOT skip any.

Return ONLY a valid JSON array. No markdown, no code blocks, no explanation, no preface text.
Output format: [{"question":"...","optionA":"...","optionB":"...","optionC":"...","optionD":"...","correctOption":"A","explanation":"","section":"General","negativeMark":"0"}]

Field rules:
- "question": full question text WITH the question number (e.g. "Q1. What is the capital of India?")
- "optionA" / "optionB" / "optionC" / "optionD": exact text of each option. If option uses (a),(b),(c),(d) or 1,2,3,4 — still map them to A,B,C,D.
- "correctOption": "A" | "B" | "C" | "D". If a correct answer is marked (circle/tick/highlight), use it. Otherwise default to "A".
- "explanation": "" (empty)
- "section": "General"
- "negativeMark": "0"

Strict rules:
1. Extract EVERY question from the image — even if there are 30 or 50.
2. Keep the original language (English OR Hindi OR mixed) — do NOT translate.
3. Return ONLY the JSON array. First character must be "[" and last must be "]".
4. No trailing commas, no comments, no prose.
5. If the image has N questions, return exactly N objects.

BEGIN JSON NOW:`;

// ─── JSON parsing (3-level fallback) ───────────────────────────
function parseQuestions(content: string): Record<string, any>[] {
  let jsonStr = (content || '').trim();
  console.log('[extract] raw content length:', jsonStr.length);

  // Strip markdown code fences
  const fence = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) jsonStr = fence[1].trim();

  // Attempt 1: direct parse
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.questions && Array.isArray(parsed.questions)) return parsed.questions;
    if (parsed?.question) return [parsed];
  } catch {
    /* keep going */
  }

  // Attempt 2: find outermost JSON array
  const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[0]);
    } catch {
      /* keep going */
    }
  }

  // Attempt 3: find individual question objects
  const objMatches = jsonStr.match(/\{[^{}]*"question"[\s\S]*?\}/g);
  if (objMatches && objMatches.length > 0) {
    return objMatches
      .map((m) => {
        try {
          return JSON.parse(m);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Record<string, any>[];
  }

  return [];
}

// ─── Normalization ──────────────────────────────────────────────
function normalize(q: Record<string, any>, index: number) {
  let correctOpt = 'A';
  if (q.correctOption) {
    const cleaned = String(q.correctOption).toUpperCase().trim();
    const first = cleaned.charAt(0);
    if (['A', 'B', 'C', 'D'].includes(first)) correctOpt = first;
  }

  return {
    question: String(q.question || `Question ${index + 1}`).trim(),
    optionA: String(q.optionA ?? q.option_a ?? q.A ?? '').trim(),
    optionB: String(q.optionB ?? q.option_b ?? q.B ?? '').trim(),
    optionC: String(q.optionC ?? q.option_c ?? q.C ?? '').trim(),
    optionD: String(q.optionD ?? q.option_d ?? q.D ?? '').trim(),
    correctOption: correctOpt,
    explanation: String(q.explanation ?? '').trim(),
    section: String(q.section ?? 'General').trim() || 'General',
    negativeMark: String(q.negativeMark ?? '0').trim() || '0',
  };
}

const PLACEHOLDER_PATTERNS = [
  'type your question', 'option a', 'option b', 'option c', 'option d',
  'why is this the correct answer', 'brief description', 'test title', 'sample question',
];

function isPlaceholder(q: any) {
  const allText = `${q.question} ${q.optionA} ${q.optionB} ${q.optionC} ${q.optionD}`.toLowerCase();
  if (q.question.length <= 10) return true;
  return PLACEHOLDER_PATTERNS.some((p) => allText.includes(p));
}

// ─── Main handler ───────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const engine = process.env.XAI_API_KEY ? 'grok' : 'zai-vlm';
    console.log(`[extract] image: ${imageFile.name} size=${imageFile.size} bytes — engine=${engine}`);

    // ── Try Grok first if key available, otherwise VLM ──
    let content = '';
    let usedEngine = '';
    try {
      if (process.env.XAI_API_KEY) {
        usedEngine = 'grok';
        content = await callGrok(dataUrl);
      } else {
        throw new Error('NO_XAI_API_KEY');
      }
    } catch (grokErr: any) {
      console.log(`[extract] Grok unavailable (${grokErr.message}), falling back to z-ai-web-dev-sdk VLM`);
      usedEngine = 'zai-vlm';
      try {
        content = await callZaiVLM(dataUrl);
      } catch (vlmErr: any) {
        console.error('[extract] VLM also failed:', vlmErr);
        return NextResponse.json({
          success: false,
          error: `Both engines failed. Grok: ${grokErr.message} | VLM: ${vlmErr.message}`,
        }, { status: 500 });
      }
    }

    // ── Parse ──
    const rawQuestions = parseQuestions(content);
    console.log(`[extract] parsed ${rawQuestions.length} raw questions from ${usedEngine}`);

    if (rawQuestions.length === 0) {
      console.log('[extract] no questions parsed. raw content preview:', content.substring(0, 500));
      return NextResponse.json({
        success: false,
        error: 'AI returned no parseable questions. Make sure the image is a clear photo of a question paper with MCQ questions.',
        rawContentPreview: content.substring(0, 300),
      }, { status: 400 });
    }

    const normalized = rawQuestions.map((q, i) => normalize(q, i));
    const realQuestions = normalized.filter((q) => !isPlaceholder(q));

    if (realQuestions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No real questions detected (only placeholders). Upload an actual question paper image.',
        detectedCount: normalized.length,
      }, { status: 400 });
    }

    console.log(`[extract] OK — ${realQuestions.length} questions (engine=${usedEngine})`);

    return NextResponse.json({
      success: true,
      questions: realQuestions,
      count: realQuestions.length,
      engine: usedEngine,
    });
  } catch (error) {
    console.error('[extract] FATAL:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to extract questions from image. Please try again with a clearer image.',
      details: String(error).substring(0, 200),
    }, { status: 500 });
  }
}
