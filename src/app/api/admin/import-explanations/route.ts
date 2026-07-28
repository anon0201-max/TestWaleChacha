import { dbConnect } from '@/lib/mongodb';
import { Test, Question } from '@/models';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const testId = formData.get('testId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!testId) {
      return NextResponse.json({ error: 'testId is required' }, { status: 400 });
    }

    // Verify test exists
    const test = await Test.findOne({ id: testId }).lean();
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Get all questions ordered by `order`
    const questions = await Question.find({ testId }).sort({ order: 1 }).lean();

    if (questions.length === 0) {
      return NextResponse.json({ error: 'No questions found for this test' }, { status: 404 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter((line) => line.trim().length > 0);

    // Parse lines like: "1: explanation", "1. explanation", "Q1: explanation", etc.
    const explanationMap = new Map<number, string>();
    const errors: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      // Match patterns: Q1: text, 1: text, 1. text, 1) text
      const match = trimmed.match(/^\s*(?:Q)?(\d+)\s*[.:)\-]\s*([\s\S]*)$/);
      if (match) {
        const questionNum = parseInt(match[1], 10);
        const explanationText = match[2].trim();
        if (explanationText) {
          explanationMap.set(questionNum, explanationText);
        } else {
          errors.push(`Empty explanation for question ${questionNum}`);
        }
      } else {
        errors.push(`Could not parse line: "${trimmed}"`);
      }
    }

    // Update questions by their 1-based order
    let updated = 0;
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const orderNum = i + 1; // 1-based order
      const explanation = explanationMap.get(orderNum);
      if (explanation) {
        await Question.findOneAndUpdate(
          { id: question.id },
          { $set: { explanation } }
        );
        updated++;
      }
    }

    return NextResponse.json({ updated, errors });
  } catch (error) {
    console.error('Import explanations error:', error);
    return NextResponse.json({ error: 'Failed to import explanations' }, { status: 500 });
  }
}
