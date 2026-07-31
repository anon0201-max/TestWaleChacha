import ZAI from 'z-ai-web-dev-sdk';

const PORT = 3005;

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

function parseQuestions(content: string): Record<string, any>[] {
  let jsonStr = (content || '').trim();

  // Strip markdown code fences
  const fence = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) jsonStr = fence[1].trim();

  // Attempt 1: direct parse
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.questions && Array.isArray(parsed.questions)) return parsed.questions;
    if (parsed?.question) return [parsed];
  } catch { /* keep going */ }

  // Attempt 2: find outermost JSON array
  const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0]); } catch { /* keep going */ }
  }

  // Attempt 3: find individual question objects
  const objMatches = jsonStr.match(/\{[^{}]*"question"[\s\S]*?\}/g);
  if (objMatches && objMatches.length > 0) {
    return objMatches
      .map((m) => { try { return JSON.parse(m); } catch { return null; } })
      .filter(Boolean) as Record<string, any>[];
  }

  return [];
}

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

async function extractQuestions(base64Data: string, mimeType: string) {
  const zai = await ZAI.create();
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  console.log(`[extract] Calling z-ai VLM... image size: ${base64Data.length} chars`);

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

  const content = response?.choices?.[0]?.message?.content || '';
  console.log(`[extract] VLM response length: ${content.length}`);

  const rawQuestions = parseQuestions(content);
  console.log(`[extract] Parsed ${rawQuestions.length} raw questions`);

  const normalized = rawQuestions.map((q, i) => normalize(q, i));
  const realQuestions = normalized.filter((q) => !isPlaceholder(q));
  console.log(`[extract] ${realQuestions.length} real questions after filtering`);

  return { questions: realQuestions, rawContentPreview: content.substring(0, 300) };
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    // Health check
    if (pathname === '/' || pathname === '/health') {
      return Response.json({ status: 'ok', service: 'extract-service', port: PORT });
    }

    // Extract endpoint
    if (pathname === '/extract' && req.method === 'POST') {
      try {
        const formData = await req.formData();
        const imageFile = formData.get('image') as File | null;

        if (!imageFile) {
          return Response.json({ success: false, error: 'No image file provided' }, { status: 400 });
        }

        const buffer = await imageFile.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        const mimeType = imageFile.type || 'image/jpeg';

        const result = await extractQuestions(base64, mimeType);

        if (result.questions.length === 0) {
          return Response.json({
            success: false,
            error: 'AI returned no parseable questions. Make sure the image is a clear photo of a question paper with MCQ questions.',
            rawContentPreview: result.rawContentPreview,
          }, { status: 400 });
        }

        return Response.json({
          success: true,
          questions: result.questions,
          count: result.questions.length,
          engine: 'zai-vlm',
        });
      } catch (error: any) {
        console.error('[extract] Error:', error);
        return Response.json({
          success: false,
          error: `Extraction failed: ${error.message}`,
        }, { status: 500 });
      }
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  },
});

console.log(`🚀 Extract service running on port ${PORT}`);
