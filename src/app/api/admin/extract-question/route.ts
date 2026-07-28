import { dbConnect } from '@/lib/mongodb';
import { Test, Question } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

// Allow up to 5 minutes for VLM processing (large images take 30-60 seconds)
export const maxDuration = 300;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

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

    console.log('🔍 Starting VLM multi-question extraction for:', imageFile.name, 'size:', imageFile.size);

    // Use z-ai-web-dev-sdk VLM to extract ALL questions from image
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert MCQ question extraction assistant. This image contains MULTIPLE multiple choice questions (MCQs).

Your task: Extract ALL questions from this image. Do NOT miss any question. Count every single question visible in the image.

Return ONLY a valid JSON array with no markdown, no code blocks, no extra text.
Each element in the array must have these fields:
- question (string): the full question text with question number
- optionA (string): option A text
- optionB (string): option B text
- optionC (string): option C text
- optionD (string): option D text
- correctOption (string): one of A/B/C/D - the correct answer (if visible in image, otherwise leave empty string)
- explanation (string): leave empty string if not provided in image
- section (string): leave "General" if not specified

IMPORTANT RULES:
1. Extract EVERY question visible in the image - do not skip any
2. Include the question number in the question text (e.g. "Q1. What is...")
3. Return a JSON ARRAY like: [{"question":"...","optionA":"...","optionB":"...","optionC":"...","optionD":"...","correctOption":"A","explanation":"","section":"General"}, ...]
4. If there are 34 questions, return 34 objects in the array
5. Return ONLY the JSON array, nothing else
6. Make sure the JSON is valid and complete`,
            },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    });

    console.log('✅ VLM response received');

    const content = response?.choices?.[0]?.message?.content || '';
    console.log('📝 Raw response length:', content.length);
    console.log('📝 Raw response preview:', content.substring(0, 300));

    // Try to parse JSON array from the response
    let jsonStr = content.trim();

    // Remove markdown code blocks if present
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let questions: any[] = [];

    try {
      const parsed = JSON.parse(jsonStr);
      // Check if it's an array
      if (Array.isArray(parsed)) {
        questions = parsed;
      } else if (parsed && parsed.questions && Array.isArray(parsed.questions)) {
        // Sometimes VLM wraps in an object with "questions" key
        questions = parsed.questions;
      } else if (parsed && parsed.question) {
        // Single question returned - wrap in array
        questions = [parsed];
      }
    } catch {
      // Try to find JSON array in the string
      const arrMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        try {
          questions = JSON.parse(arrMatch[0]);
        } catch {
          // Try individual objects
          const objMatches = jsonStr.match(/\{[\s\S]*?\}/g);
          if (objMatches && objMatches.length > 0) {
            questions = objMatches.map(m => {
              try { return JSON.parse(m); } catch { return null; }
            }).filter(Boolean);
          }
        }
      }

      if (questions.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Could not parse questions from image. Please ensure the image contains clear MCQs.',
          raw: content.substring(0, 500),
        }, { status: 400 });
      }
    }

    // Normalize each question
    const normalizedQuestions = questions.map((q: any, index: number) => {
      // Normalize correctOption
      let correctOpt = 'A';
      if (q.correctOption) {
        const cleaned = String(q.correctOption).toUpperCase().trim();
        if (['A', 'B', 'C', 'D'].includes(cleaned.charAt(0))) {
          correctOpt = cleaned.charAt(0);
        }
      }

      return {
        question: q.question || `Question ${index + 1}`,
        optionA: q.optionA || '',
        optionB: q.optionB || '',
        optionC: q.optionC || '',
        optionD: q.optionD || '',
        correctOption: correctOpt,
        explanation: q.explanation || '',
        section: q.section || 'General',
        negativeMark: q.negativeMark || '0',
      };
    });

    // FILTER OUT placeholder/empty questions (when user uploads screenshot of app, not real question paper)
    const PLACEHOLDER_PATTERNS = [
      'type your question',
      'option a',
      'option b',
      'option c',
      'option d',
      'why is this the correct answer',
      'brief description',
      'test title',
    ];

    const realQuestions = normalizedQuestions.filter((q: any) => {
      const allText = `${q.question} ${q.optionA} ${q.optionB} ${q.optionC} ${q.optionD}`.toLowerCase();
      // Check if question text is just placeholder
      const isPlaceholder = PLACEHOLDER_PATTERNS.some(p => allText.includes(p));
      // Check if question has actual content (more than 15 chars and not just placeholder)
      const hasRealContent = q.question && q.question.trim().length > 15 && !isPlaceholder;
      return hasRealContent;
    });

    if (realQuestions.length === 0) {
      console.log('⚠️ No real questions found - likely a screenshot of app or non-question image');
      return NextResponse.json({
        success: false,
        error: 'No real questions found in image. Please upload an actual question paper / question image (not a screenshot of the app interface). Make sure the image contains clear MCQ questions with options.',
        detectedCount: normalizedQuestions.length,
      }, { status: 400 });
    }

    console.log(`✅ Extracted ${realQuestions.length} real questions from image (filtered out ${normalizedQuestions.length - realQuestions.length} placeholders)`);

    return NextResponse.json({
      success: true,
      questions: realQuestions,
      count: realQuestions.length,
    });
  } catch (error) {
    console.error('❌ Error extracting questions from image:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to extract questions from image. Please try again.',
      details: String(error),
    }, { status: 500 });
  }
}
