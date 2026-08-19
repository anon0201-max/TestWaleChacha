import ZAI from 'z-ai-web-dev-sdk';

const PORT = 3005;

const EXTRACT_PROMPT = `You are an expert exam paper OCR scanner. This image contains MULTIPLE MCQ questions from a competitive exam paper.

CRITICAL: Extract EVERY single question visible in the image. Do NOT skip any.

Return ONLY a valid JSON array. No markdown, no code blocks, no explanation, no preface text.
Output format: [{"question":"...","optionA":"...","optionB":"...","optionC":"...","optionD":"...","correctOption":"A","explanation":"","section":"General","negativeMark":"0"}]

Field rules:
- "question": full question text ONLY. Do NOT include any options in this field. Remove the question number prefix (e.g. remove "1." or "Q1."). Include the COMPLETE question text — NEVER truncate or cut it short with "...".
- "optionA": ONLY the text of option A/first option. Do NOT include the "(A)" label. Do NOT include any other option's text. Each option field must contain EXACTLY ONE option.
- "optionB": ONLY the text of option B/second option. Do NOT include the "(B)" label. Do NOT include any other option's text.
- "optionC": ONLY the text of option C/third option. Do NOT include the "(C)" label. Do NOT include any other option's text.
- "optionD": ONLY the text of option D/fourth option. Do NOT include the "(D)" label. Do NOT include any other option's text.
- "correctOption": "A" | "B" | "C" | "D". If a correct answer is marked (circle/tick/highlight/underline/bold), use it. If text says "उत्तर: (B)" or "Answer: (C)", use that letter. Otherwise default to "A".
- "explanation": "" (always empty string, no text)
- "section": "General"
- "negativeMark": "0"

CRITICAL RULES — FAILURE TO FOLLOW THESE WILL CAUSE DATA CORRUPTION:
1. NEVER MERGE OPTIONS. Each of optionA, optionB, optionC, optionD must contain EXACTLY ONE option text. NEVER put multiple options in one field like "(A) text1 (B) text2".
2. NEVER TRUNCATE. Always output the COMPLETE text of every question and option. Never use "..." to cut short.
3. Extract EVERY question from the image — even if there are 30, 50, or 100.
4. Keep the original language (English OR Hindi OR Hinglish/mixed) — do NOT translate or modify.
5. Return ONLY the JSON array. First character must be "[" and last must be "]".
6. No trailing commas, no comments, no prose, no markdown.
7. If the image shows a multi-column layout (questions in 2 or 3 columns side by side), extract ALL questions from ALL columns in order.
8. Each question MUST have exactly 4 option fields. If fewer than 4 options are visible, put "" for the missing ones.

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

  // Clean option text — remove (A)/(B)/(C)/(D) prefixes and merge artifacts
  const cleanOpt = (val: any) => {
    let text = String(val ?? '').trim();
    // Remove option label prefix like (A), (B), a), b), A., B.
    text = text.replace(/^\s*\(?[A-Da-d]\)?[\).]\s*/, '');
    // Remove merged option artifacts: if text contains another option label, cut it
    text = text.replace(/\s*\(?[A-Da-d]\)?[\).].*$/s, '');
    return text.trim();
  };

  return {
    question: String(q.question || `Question ${index + 1}`).trim(),
    optionA: cleanOpt(q.optionA ?? q.option_a ?? q.A),
    optionB: cleanOpt(q.optionB ?? q.option_b ?? q.B),
    optionC: cleanOpt(q.optionC ?? q.option_c ?? q.C),
    optionD: cleanOpt(q.optionD ?? q.option_d ?? q.D),
    correctOption: correctOpt,
    explanation: '',
    section: 'General',
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
