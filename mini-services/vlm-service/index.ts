/**
 * VLM Question Extraction Service
 * Runs on port 3030 - handles AI vision requests without Vercel serverless timeout
 */

const PORT = 3030;

// Lazy-init ZAI SDK
let zaiInstance: any = null;
async function getZAI() {
  if (!zaiInstance) {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    zaiInstance = await ZAI.create();
    console.log('🧠 ZAI SDK initialized');
  }
  return zaiInstance;
}

// Parse multipart form data manually (no multer needed with bun native)
function parseMultipart(body: Uint8Array, contentType: string): Record<string, any> {
  const boundary = contentType.split('boundary=')[1];
  if (!boundary) throw new Error('No boundary in content-type');

  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(body);
  const parts: Record<string, any> = {};

  const boundaryMarker = `--${boundary}`;
  const sections = text.split(boundaryMarker).slice(1, -1); // skip first empty, last --marker--

  for (const section of sections) {
    const headerEnd = section.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;

    const headers = section.substring(0, headerEnd);
    const content = section.substring(headerEnd + 4).replace(/\r\n$/, '');

    // Extract field name
    const nameMatch = headers.match(/name="([^"]+)"/);
    if (!nameMatch) continue;

    const fieldName = nameMatch[1];

    // Check if it's a file
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    if (filenameMatch) {
      // Get the raw binary content between headers and boundary
      const headerBytes = new TextEncoder().encode(section.substring(0, headerEnd + 4));
      const endMarker = new TextEncoder().encode(`\r\n--${boundary}`);
      // Find end of content (before next boundary)
      const rawSection = section.substring(headerEnd + 4);
      const endIdx = rawSection.lastIndexOf('--');
      const fileContent = rawSection.substring(0, endIdx - 2); // remove trailing \r\n

      // Re-encode: get original bytes for this part
      const fullSection = boundaryMarker + section;
      const fullSectionBytes = new TextEncoder().encode(fullSection);
      // Find content start in original body
      // Simpler: just use the content as base64
      parts[fieldName] = {
        filename: filenameMatch[1],
        content: fileContent,
        // For base64, we need to work with the original body bytes
      };
    } else {
      parts[fieldName] = content;
    }
  }

  return parts;
}

// Better multipart parser using byte offsets
function extractFileFromMultipart(body: Buffer, contentType: string): { base64: string; mimeType: string; filename: string } | null {
  const boundary = contentType.split('boundary=')[1];
  if (!boundary) return null;

  const boundaryBuf = Buffer.from(`--${boundary}\r\n`);
  const headerEndBuf = Buffer.from('\r\n\r\n');
  const endBoundaryBuf = Buffer.from(`\r\n--${boundary}`);

  // Find first boundary
  let start = body.indexOf(boundaryBuf);
  if (start === -1) return null;
  start += boundaryBuf.length;

  // Find end of headers
  const headerEndIdx = body.indexOf(headerEndBuf, start);
  if (headerEndIdx === -1) return null;

  const headers = body.subarray(start, headerEndIdx).toString('utf-8');
  const contentStart = headerEndIdx + headerEndBuf.length;

  // Find end boundary
  const endIdx = body.indexOf(endBoundaryBuf, contentStart);
  if (endIdx === -1) return null;

  const fileContent = body.subarray(contentStart, endIdx);

  // Parse headers
  const filenameMatch = headers.match(/filename="([^"]+)"/);
  const mimeTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/);

  return {
    base64: fileContent.toString('base64'),
    mimeType: mimeTypeMatch?.[1] || 'image/jpeg',
    filename: filenameMatch?.[1] || 'image.jpg',
  };
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Health check
    if (url.pathname === '/health' && req.method === 'GET') {
      return Response.json({ status: 'ok', service: 'vlm-extractor', timestamp: new Date().toISOString() });
    }

    // Extract questions
    if (url.pathname === '/extract' && req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type') || '';
        const body = await req.arrayBuffer();
        const buf = Buffer.from(body);

        const file = extractFileFromMultipart(buf, contentType);
        if (!file) {
          return Response.json({ success: false, error: 'No image file provided' }, { status: 400 });
        }

        console.log(`📸 [${new Date().toISOString()}] Extracting from: ${file.filename}, size: ${buf.length}`);

        const zai = await getZAI();
        const dataUrl = `data:${file.mimeType};base64,${file.base64}`;

        const response = await zai.chat.completions.createVision({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `You are an expert exam paper scanner. This image contains MULTIPLE MCQ questions.

CRITICAL: Extract ALL questions. Do NOT miss any.

Return ONLY a valid JSON array. No markdown, no code blocks.
Each element must have:
- "question": full question text with question number
- "optionA": text of option A
- "optionB": text of option B
- "optionC": text of option C
- "optionD": text of option D
- "correctOption": "A"/"B"/"C"/"D" (leave "A" if not visible)
- "explanation": ""
- "section": "General"
- "negativeMark": "0"

RULES:
1. Extract EVERY question visible
2. Keep question numbers (Q1, Q2 etc)
3. English OR Hindi - extract as-is
4. Normalize options to A,B,C,D
5. Return JSON array only
6. If N questions visible, return N objects
7. Valid JSON only`,
                },
                { type: 'image_url', image_url: { url: dataUrl } },
              ],
            },
          ],
          thinking: { type: 'disabled' },
        });

        const content = response?.choices?.[0]?.message?.content || '';
        console.log(`📝 Response length: ${content.length}`);

        // Parse JSON
        let jsonStr = content.trim();
        const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1].trim();

        let questions: Record<string, any>[] = [];

        try {
          const parsed = JSON.parse(jsonStr);
          if (Array.isArray(parsed)) questions = parsed;
          else if (parsed?.questions && Array.isArray(parsed.questions)) questions = parsed.questions;
          else if (parsed?.question) questions = [parsed];
        } catch {
          const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
          if (arrMatch) {
            try { questions = JSON.parse(arrMatch[0]); } catch {
              const objs = jsonStr.match(/\{[^{}]*"question"[^{}]*\}/g);
              if (objs) questions = objs.map(m => { try { return JSON.parse(m); } catch { return null; } }).filter(Boolean) as any[];
            }
          }
        }

        if (questions.length === 0) {
          return Response.json({ success: false, error: 'Could not extract questions from image.' }, { status: 400 });
        }

        // Normalize
        const normalized = questions.map((q, i) => {
          let co = 'A';
          if (q.correctOption) {
            const c = String(q.correctOption).toUpperCase().trim();
            if (['A','B','C','D'].includes(c[0])) co = c[0];
          }
          return {
            question: String(q.question || `Question ${i+1}`).trim(),
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

        // Filter placeholders
        const PHL = ['type your question','option a','option b','option c','option d','why is this the correct answer','brief description','test title'];
        const real = normalized.filter(q => {
          const t = `${q.question} ${q.optionA} ${q.optionB} ${q.optionC} ${q.optionD}`.toLowerCase();
          return q.question.length > 10 && !PHL.some(p => t.includes(p));
        });

        if (real.length === 0) {
          return Response.json({ success: false, error: 'No real questions found. Upload clear question paper photo.' }, { status: 400 });
        }

        console.log(`✅ Extracted ${real.length} questions`);
        return Response.json({ success: true, questions: real, count: real.length });

      } catch (error: any) {
        console.error('❌ Error:', error?.message || error);
        return Response.json({ success: false, error: 'Failed to extract. Try again.', details: String(error).substring(0, 200) }, { status: 500 });
      }
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  },
});

console.log(`🧠 VLM Extract Service running on port ${PORT}`);
