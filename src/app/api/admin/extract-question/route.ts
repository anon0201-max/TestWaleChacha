import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('🔍 Starting VLM extraction:', imageFile.name, 'size:', imageFile.size);

    // Use z-ai-web-dev-sdk VLM
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert exam paper scanner. This image contains MULTIPLE MCQ questions from a competitive exam paper.

CRITICAL TASK: Extract ALL questions from this image. Do NOT miss any single question.

Return ONLY a valid JSON array. No markdown, no code blocks, no explanation text.
Each element must have exactly these fields:
- "question": full question text including question number (e.g. "Q1. What is capital of India?")
- "optionA": text of option A
- "optionB": text of option B  
- "optionC": text of option C
- "optionD": text of option D
- "correctOption": "A" or "B" or "C" or "D" (leave "A" if answer is not visible/marked)
- "explanation": leave empty string ""
- "section": leave "General"
- "negativeMark": leave "0"

RULES:
1. Extract EVERY single question visible in the image
2. Keep question numbers in question text (Q1, Q2 etc)
3. Questions may be in English OR Hindi - extract as-is, do not translate
4. If options have (a), (b), (c), (d) - normalize to just A, B, C, D
5. Return JSON array only: [{"question":"...","optionA":"...","optionB":"...","optionC":"...","optionD":"...","correctOption":"A","explanation":"","section":"General","negativeMark":"0"}]
6. If image has N questions, return exactly N objects in array
7. Make sure JSON is valid and complete`,
            },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    });

    const content = response?.choices?.[0]?.message?.content || '';
    console.log('📝 VLM response length:', content.length);

    // Parse JSON from response
    let jsonStr = content.trim();

    // Remove markdown code blocks
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    let questions: Record<string, any>[] = [];

    // Try direct parse
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        questions = parsed;
      } else if (parsed?.questions && Array.isArray(parsed.questions)) {
        questions = parsed.questions;
      } else if (parsed?.question) {
        questions = [parsed];
      }
    } catch {
      // Fallback: find JSON array in string
      const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        try {
          questions = JSON.parse(arrMatch[0]);
        } catch {
          // Last resort: find individual objects
          const objMatches = jsonStr.match(/\{[^{}]*"question"[^{}]*\}/g);
          if (objMatches) {
            questions = objMatches.map(m => {
              try { return JSON.parse(m); } catch { return null; }
            }).filter(Boolean) as Record<string, any>[];
          }
        }
      }
    }

    if (questions.length === 0) {
      console.log('⚠️ No questions parsed from VLM response');
      return NextResponse.json({
        success: false,
        error: 'Could not extract questions from image. Make sure the image is a clear photo of a question paper with MCQ questions.',
      }, { status: 400 });
    }

    // Normalize each question
    const normalized = questions.map((q, index) => {
      // Normalize correctOption
      let correctOpt = 'A';
      if (q.correctOption) {
        const cleaned = String(q.correctOption).toUpperCase().trim();
        if (['A', 'B', 'C', 'D'].includes(cleaned.charAt(0))) {
          correctOpt = cleaned.charAt(0);
        }
      }

      return {
        question: String(q.question || `Question ${index + 1}`).trim(),
        optionA: String(q.optionA || '').trim(),
        optionB: String(q.optionB || '').trim(),
        optionC: String(q.optionC || '').trim(),
        optionD: String(q.optionD || '').trim(),
        correctOption: correctOpt,
        explanation: String(q.explanation || '').trim(),
        section: String(q.section || 'General').trim(),
        negativeMark: String(q.negativeMark || '0').trim(),
      };
    });

    // Filter out placeholder/empty questions
    const PLACEHOLDER_PATTERNS = [
      'type your question', 'option a', 'option b', 'option c', 'option d',
      'why is this the correct answer', 'brief description', 'test title',
    ];

    const realQuestions = normalized.filter(q => {
      const allText = `${q.question} ${q.optionA} ${q.optionB} ${q.optionC} ${q.optionD}`.toLowerCase();
      const isPlaceholder = PLACEHOLDER_PATTERNS.some(p => allText.includes(p));
      return q.question.length > 10 && !isPlaceholder;
    });

    if (realQuestions.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No real questions found in image. Please upload an actual question paper photo with clear MCQ questions.',
        detectedCount: normalized.length,
      }, { status: 400 });
    }

    console.log(`✅ Extracted ${realQuestions.length} questions from image`);

    return NextResponse.json({
      success: true,
      questions: realQuestions,
      count: realQuestions.length,
    });
  } catch (error) {
    console.error('❌ VLM extraction error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to extract questions from image. Please try again with a clearer image.',
      details: String(error).substring(0, 200),
    }, { status: 500 });
  }
}
