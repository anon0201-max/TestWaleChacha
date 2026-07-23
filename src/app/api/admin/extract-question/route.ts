import { NextRequest, NextResponse } from 'next/server';

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

    console.log('🔍 Starting VLM extraction for:', imageFile.name, 'size:', imageFile.size);

    // Use z-ai-web-dev-sdk VLM to extract question from image
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an MCQ question extraction assistant. Extract the multiple choice question from this image.

Return ONLY valid JSON with no markdown, no code blocks, no extra text.
The JSON must have these fields:
- question (string): the question text
- optionA (string): option A text
- optionB (string): option B text
- optionC (string): option C text
- optionD (string): option D text
- correctOption (string): one of A/B/C/D - the correct answer
- explanation (string): brief explanation of why the correct answer is right
- section (string): subject area/topic

Return JSON only:`,
            },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    });

    console.log('✅ VLM response received');

    const content = response?.choices?.[0]?.message?.content || '';
    console.log('📝 Raw response:', content.substring(0, 200));

    // Try to parse JSON from the response - handle possible markdown wrapping
    let jsonStr = content.trim();
    // Remove markdown code blocks if present
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let question;
    try {
      question = JSON.parse(jsonStr);
    } catch {
      // Try to find JSON object in the string
      const objMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (objMatch) {
        question = JSON.parse(objMatch[0]);
      } else {
        return NextResponse.json({
          success: false,
          error: 'Could not parse question data from image. Please ensure the image contains a clear MCQ.',
          raw: content,
        }, { status: 400 });
      }
    }

    // Validate required fields
    if (!question.question || !question.optionA || !question.optionB) {
      return NextResponse.json({
        success: false,
        error: 'Extracted data is incomplete. Missing question text or options.',
        extracted: question,
      }, { status: 400 });
    }

    // Normalize correctOption
    if (question.correctOption) {
      question.correctOption = question.correctOption.toUpperCase().charAt(0);
      if (!['A', 'B', 'C', 'D'].includes(question.correctOption)) {
        question.correctOption = 'A';
      }
    } else {
      question.correctOption = 'A';
    }

    console.log('✅ Question extracted successfully:', question.question?.substring(0, 50));

    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error('❌ Error extracting question from image:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to extract question from image. Please try again.',
      details: String(error),
    }, { status: 500 });
  }
}
