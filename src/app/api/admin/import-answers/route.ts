import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const testId = formData.get('testId') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!testId) {
      return NextResponse.json({ success: false, error: 'No test ID provided' }, { status: 400 });
    }

    // Verify test exists
    const test = await db.test.findUnique({ where: { id: testId } });
    if (!test) {
      return NextResponse.json({ success: false, error: 'Test not found' }, { status: 404 });
    }

    // Read file content
    const text = await file.text();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Parse answers: each line should be in format "Q<number> <answer>" or just "<answer>" per line
    let updated = 0;
    const questions = await db.question.findMany({
      where: { testId },
      orderBy: { order: 'asc' },
    });

    for (const line of lines) {
      // Try formats: "Q1 A", "Q1: A", "1. A", "1 A", "1,A", or just "A" per line
      let questionIndex = -1;
      let answer = '';

      // Format: Q<number> <answer> or Q<number>:<answer> or Q<number>-<answer>
      const qMatch = line.match(/^Q\s*(\d+)\s*[:.\-,\s]*\s*([A-Da-d])/i);
      if (qMatch) {
        questionIndex = parseInt(qMatch[1], 10) - 1; // 1-based to 0-based
        answer = qMatch[2].toUpperCase();
      } else {
        // Format: <number>. <answer> or <number> <answer> or <number>,<answer>
        const numMatch = line.match(/^(\d+)\s*[:.\-,\s]*\s*([A-Da-d])/i);
        if (numMatch) {
          questionIndex = parseInt(numMatch[1], 10) - 1;
          answer = numMatch[2].toUpperCase();
        } else if (/^[A-Da-d]$/.test(line.trim())) {
          // Format: just a single letter A-D per line (use line number as question index)
          answer = line.trim().toUpperCase();
          // Find the next unanswered question
          const foundIdx = questions.findIndex((q, idx) => {
            const alreadyProcessed = lines.slice(0, lines.indexOf(line)).some((prevLine) => {
              const prevQ = prevLine.match(/^Q\s*(\d+)/i) || prevLine.match(/^(\d+)\s*[.:.\-,\s]/);
              return prevQ && parseInt(prevQ[1], 10) - 1 === idx;
            });
            return false; // We'll use a simpler approach below
          });
        }
      }

      // Apply the answer if valid
      if (questionIndex >= 0 && questionIndex < questions.length && ['A', 'B', 'C', 'D'].includes(answer)) {
        await db.question.update({
          where: { id: questions[questionIndex].id },
          data: { correctOption: answer },
        });
        updated++;
      }
    }

    // If no answers were parsed with question numbers, try line-by-line approach
    if (updated === 0) {
      let lineIdx = 0;
      for (const line of lines) {
        const trimmed = line.trim().toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(trimmed) && lineIdx < questions.length) {
          await db.question.update({
            where: { id: questions[lineIdx].id },
            data: { correctOption: trimmed },
          });
          updated++;
          lineIdx++;
        }
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Error importing answers:', error);
    return NextResponse.json({ success: false, error: 'Failed to import answers' }, { status: 500 });
  }
}
