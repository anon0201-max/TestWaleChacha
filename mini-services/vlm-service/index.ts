/**
 * VLM Question Extraction Mini Service
 * Port 3030 - handles AI vision requests (no Vercel timeout)
 */

const PORT = 3030;
let zaiInstance: any = null;

async function getZAI() {
  if (!zaiInstance) {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    zaiInstance = await ZAI.create();
    console.log('🧠 ZAI SDK initialized');
  }
  return zaiInstance;
}

function extractFileFromMultipart(body: Buffer, contentType: string): { base64: string; mimeType: string; filename: string } | null {
  const boundary = contentType.split('boundary=')[1];
  if (!boundary) return null;

  const endBoundary = Buffer.from(`\r\n--${boundary}`);
  const headerSep = Buffer.from('\r\n\r\n');

  let start = body.indexOf(Buffer.from(`--${boundary}`));
  if (start === -1) return null;
  start = body.indexOf(headerSep, start);
  if (start === -1) return null;
  start += headerSep.length;

  const end = body.indexOf(endBoundary, start);
  if (end === -1) return null;

  const fileContent = body.subarray(start, end);

  // Parse headers before content
  const headerStart = body.indexOf(Buffer.from(`--${boundary}`));
  const headersRaw = body.subarray(headerStart, start - headerSep.length).toString('utf-8');
  const filenameMatch = headersRaw.match(/filename="([^"]+)"/);
  const mimeMatch = headersRaw.match(/Content-Type:\s*([^\r\n]+)/);

  return {
    base64: fileContent.toString('base64'),
    mimeType: mimeMatch?.[1] || 'image/jpeg',
    filename: filenameMatch?.[1] || 'image.jpg',
  };
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === '/health' && req.method === 'GET') {
      return Response.json({ status: 'ok', service: 'vlm-extractor' });
    }

    if (url.pathname === '/extract' && req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type') || '';
        const bodyBuf = Buffer.from(await req.arrayBuffer());

        const file = extractFileFromMultipart(bodyBuf, contentType);
        if (!file) {
          return Response.json({ success: false, error: 'No image file in request' }, { status: 400 });
        }

        console.log(`📸 Extracting: ${file.filename} (${(bodyBuf.length / 1024).toFixed(0)}KB)`);

        const zai = await getZAI();
        const dataUrl = `data:${file.mimeType};base64,${file.base64}`;

        const response = await zai.chat.completions.createVision({
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: `You are an expert exam paper scanner. Extract ALL MCQ questions from this image.

Return ONLY a valid JSON array. No markdown, no code blocks.
Each element:
- "question": full text with question number
- "optionA": option A
- "optionB": option B
- "optionC": option C
- "optionD": option D
- "correctOption": "A"/"B"/"C"/"D" (leave "A" if not visible)
- "explanation": ""
- "section": "General"
- "negativeMark": "0"

Rules: Extract EVERY question. Keep Q numbers. English/Hindi as-is. Normalize options to A/B/C/D. Return array only.` },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          }],
          thinking: { type: 'disabled' },
        });

        const content = response?.choices?.[0]?.message?.content || '';
        console.log(`📝 Response: ${content.length} chars`);

        // Parse JSON
        let jsonStr = content.trim();
        const jm = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jm) jsonStr = jm[1].trim();

        let questions: Record<string, any>[] = [];
        try {
          const p = JSON.parse(jsonStr);
          if (Array.isArray(p)) questions = p;
          else if (p?.questions) questions = p.questions;
          else if (p?.question) questions = [p];
        } catch {
          const am = jsonStr.match(/\[[\s\S]*\]/);
          if (am) try { questions = JSON.parse(am[0]); } catch {
            const om = jsonStr.match(/\{[^{}]*"question"[^{}]*\}/g);
            if (om) questions = om.map(m => { try { return JSON.parse(m); } catch { return null; } }).filter(Boolean) as any[];
          }
        }

        if (questions.length === 0) {
          return Response.json({ success: false, error: 'No questions extracted from image.' }, { status: 400 });
        }

        const normalized = questions.map((q, i) => {
          let co = 'A';
          if (q.correctOption) { const c = String(q.correctOption).toUpperCase().trim(); if ('ABCD'.includes(c[0])) co = c[0]; }
          return {
            question: String(q.question || `Q${i+1}`).trim(),
            optionA: String(q.optionA || '').trim(),
            optionB: String(q.optionB || '').trim(),
            optionC: String(q.optionC || '').trim(),
            optionD: String(q.optionD || '').trim(),
            correctOption: co,
            explanation: String(q.explanation || '').trim(),
            section: String(q.section || 'General').trim(),
            negativeMark: String(q.negativeMark || '0').trim(),
          };
        });

        const PHL = ['type your question','option a','option b','option c','option d','brief description'];
        const real = normalized.filter(q => {
          const t = `${q.question} ${q.optionA} ${q.optionB}`.toLowerCase();
          return q.question.length > 10 && !PHL.some(p => t.includes(p));
        });

        console.log(`✅ ${real.length} questions extracted`);
        return Response.json({ success: true, questions: real, count: real.length });

      } catch (error: any) {
        console.error('❌ Error:', error?.message || error);
        return Response.json({ success: false, error: 'Extraction failed. Try again.', details: String(error).substring(0, 200) }, { status: 500 });
      }
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  },
});

console.log(`🧠 VLM Service running on port ${PORT}`);
