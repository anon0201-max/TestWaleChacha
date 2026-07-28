/**
 * Extract all data from SQLite database to JSON files
 * This data will be used to seed MongoDB Atlas
 */
import { PrismaClient } from '@prisma/client';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:/home/z/my-project/db/custom.db',
    },
  },
});

const outputDir = '/home/z/my-project/scripts/data';
mkdirSync(outputDir, { recursive: true });

async function extract() {
  console.log('📦 Extracting data from SQLite...\n');

  const categories = await prisma.category.findMany();
  writeFileSync(join(outputDir, 'categories.json'), JSON.stringify(categories, null, 2));
  console.log(`✅ Categories: ${categories.length}`);

  const tests = await prisma.test.findMany();
  writeFileSync(join(outputDir, 'tests.json'), JSON.stringify(tests, null, 2));
  console.log(`✅ Tests: ${tests.length}`);

  const questions = await prisma.question.findMany();
  writeFileSync(join(outputDir, 'questions.json'), JSON.stringify(questions, null, 2));
  console.log(`✅ Questions: ${questions.length}`);

  const students = await prisma.student.findMany();
  writeFileSync(join(outputDir, 'students.json'), JSON.stringify(students, null, 2));
  console.log(`✅ Students: ${students.length}`);

  const attempts = await prisma.testAttempt.findMany();
  writeFileSync(join(outputDir, 'testAttempts.json'), JSON.stringify(attempts, null, 2));
  console.log(`✅ TestAttempts: ${attempts.length}`);

  const payments = await prisma.payment.findMany();
  writeFileSync(join(outputDir, 'payments.json'), JSON.stringify(payments, null, 2));
  console.log(`✅ Payments: ${payments.length}`);

  const adminPasswords = await prisma.adminPassword.findMany();
  writeFileSync(join(outputDir, 'adminPasswords.json'), JSON.stringify(adminPasswords, null, 2));
  console.log(`✅ AdminPasswords: ${adminPasswords.length}`);

  console.log('\n📁 All data saved to:', outputDir);
  await prisma.$disconnect();
}

extract().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
