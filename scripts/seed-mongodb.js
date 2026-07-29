// Seed script: Move all data from SQLite (Prisma) to MongoDB Atlas
const { MongoClient } = require('mongodb');
const { PrismaClient } = require('@prisma/client');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://testwalechacha:Cool0201@cluster0.pwq4n8y.mongodb.net/testwalechacha?retryWrites=true&w=majority';

// Remove null/undefined fields so MongoDB doesn't store null (causes unique index issues)
function clean(obj) {
  const cleaned = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) cleaned[k] = v;
  }
  return cleaned;
}

async function seed() {
  const mongo = new MongoClient(MONGO_URI);
  const prisma = new PrismaClient();

  try {
    await mongo.connect();
    console.log('✅ MongoDB connected');
    
    const db = mongo.db();

    // 1. Clear existing data (in order to avoid conflicts)
    console.log('\n🗑️  Clearing existing MongoDB data...');
    await db.collection('questions').deleteMany({});
    await db.collection('testattempts').deleteMany({});
    await db.collection('payments').deleteMany({});
    await db.collection('tests').deleteMany({});
    await db.collection('students').deleteMany({});
    await db.collection('adminpasswords').deleteMany({});
    await db.collection('categories').deleteMany({});
    console.log('✅ MongoDB cleared');

    // 2. Seed Categories
    const categories = await prisma.category.findMany({ orderBy: { createdAt: 'asc' } });
    console.log(`\n📦 Seeding ${categories.length} categories...`);
    if (categories.length > 0) {
      await db.collection('categories').insertMany(categories.map(c => clean({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        color: c.color,
        examType: c.examType,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })));
      console.log('✅ Categories seeded');
    }

    // 3. Seed Tests
    const tests = await prisma.test.findMany({ orderBy: { createdAt: 'asc' } });
    console.log(`\n📦 Seeding ${tests.length} tests...`);
    if (tests.length > 0) {
      await db.collection('tests').insertMany(tests.map(t => clean({
        id: t.id,
        title: t.title,
        description: t.description,
        categoryId: t.categoryId,
        difficulty: t.difficulty,
        timeLimit: t.timeLimit,
        totalQuestions: t.totalQuestions,
        examName: t.examName,
        isActive: t.isActive,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })));
      console.log('✅ Tests seeded');
    }

    // 4. Seed Questions
    const questions = await prisma.question.findMany({ orderBy: { order: 'asc' } });
    console.log(`\n📦 Seeding ${questions.length} questions...`);
    if (questions.length > 0) {
      await db.collection('questions').insertMany(questions.map(q => clean({
        id: q.id,
        testId: q.testId,
        question: q.question,
        questionImage: q.questionImage,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        explanation: q.explanation,
        order: q.order,
        negativeMark: q.negativeMark,
        section: q.section,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })));
      console.log('✅ Questions seeded');
    }

    // 5. Seed Students
    const students = await prisma.student.findMany({ orderBy: { createdAt: 'asc' } });
    console.log(`\n📦 Seeding ${students.length} students...`);
    if (students.length > 0) {
      await db.collection('students').insertMany(students.map(s => clean({
        id: s.id,
        name: s.name,
        email: s.email,
        passwordHash: s.passwordHash,
        phone: s.phone,
        deviceId: s.deviceId,
        freeTestsUsed: s.freeTestsUsed,
        isSubscribed: s.isSubscribed,
        subscriptionAt: s.subscriptionAt,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })));
      console.log('✅ Students seeded');
    }

    // 6. Seed Test Attempts
    const attempts = await prisma.testAttempt.findMany({ orderBy: { createdAt: 'asc' } });
    console.log(`\n📦 Seeding ${attempts.length} test attempts...`);
    if (attempts.length > 0) {
      await db.collection('testattempts').insertMany(attempts.map(a => clean({
        id: a.id,
        studentId: a.studentId,
        testId: a.testId,
        score: a.score,
        totalQuestions: a.totalQuestions,
        correctAnswers: a.correctAnswers,
        timeTaken: a.timeTaken,
        answers: a.answers,
        completed: a.completed,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })));
      console.log('✅ Test Attempts seeded');
    }

    // 7. Seed Payments
    const payments = await prisma.payment.findMany({ orderBy: { createdAt: 'asc' } });
    console.log(`\n📦 Seeding ${payments.length} payments...`);
    if (payments.length > 0) {
      await db.collection('payments').insertMany(payments.map(p => clean({
        id: p.id,
        studentId: p.studentId,
        razorpayOrderId: p.razorpayOrderId,
        razorpayPaymentId: p.razorpayPaymentId,
        razorpaySignature: p.razorpaySignature,
        amount: p.amount,
        status: p.status,
        currency: p.currency,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })));
      console.log('✅ Payments seeded');
    }

    // 8. Seed Admin Password
    const adminPasswords = await prisma.adminPassword.findMany();
    console.log(`\n📦 Seeding ${adminPasswords.length} admin passwords...`);
    if (adminPasswords.length > 0) {
      await db.collection('adminpasswords').insertMany(adminPasswords.map(a => clean({
        id: a.id,
        username: a.username,
        password: a.password,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })));
      console.log('✅ Admin Passwords seeded');
    }

    // Verify
    console.log('\n📊 Final MongoDB counts:');
    console.log('Categories:', await db.collection('categories').countDocuments());
    console.log('Tests:', await db.collection('tests').countDocuments());
    console.log('Questions:', await db.collection('questions').countDocuments());
    console.log('Students:', await db.collection('students').countDocuments());
    console.log('Test Attempts:', await db.collection('testattempts').countDocuments());
    console.log('Payments:', await db.collection('payments').countDocuments());
    console.log('Admin Passwords:', await db.collection('adminpasswords').countDocuments());

    console.log('\n🎉 Seeding complete!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await mongo.close();
  }
}

seed();
