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
    const mimeType = imageFile.type || 'image/png';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Use z-ai-web-dev-sdk VLM to extract question from image
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const response = await zai.chat.completions.createVision({
      model: 'glm-4v-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an MCQ question extraction assistant. Extract the multiple choice question from the image. Return ONLY valid JSON with no markdown, no code blocks, no extra text. The JSON must have these fields: question (string), optionA (string), optionB (string), optionC (string), optionD (string), correctOption (string, one of A/B/C/D), explanation (string, brief explanation of the correct answer), section (string, subject area).',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the MCQ question from this image. Return a JSON object with fields: question, optionA, optionB, optionC, optionD, correctOption (A/B/C/D), explanation, section.' },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
    });

    const content = response?.choices?.[0]?.message?.content || '';

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
        return NextResponse.json({ success: false, error: 'Could not parse question data from image. Please ensure the image contains a clear MCQ.' }, { status: 400 });
      }
    }

    // Validate required fields
    if (!question.question || !question.optionA || !question.optionB || !question.optionC || !question.optionD) {
      return NextResponse.json({ success: false, error: 'Extracted data is incomplete. Missing question text or options.' }, { status: 400 });
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

    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error('Error extracting question from image:', error);
    return NextResponse.json({ success: false, error: 'Failed to extract question from image' }, { status: 500 });
  }
}
