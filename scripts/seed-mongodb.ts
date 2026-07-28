/**
 * Seed MongoDB Atlas with data extracted from SQLite
 * Usage: bun run scripts/seed-mongodb.ts
 */
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://testwalechacha:Cool0201@cluster0.pwq4n8y.mongodb.net/testwalechacha?retryWrites=true&w=majority';

const dataDir = '/home/z/my-project/scripts/data';

// Simple schemas matching the Mongoose models (inline to avoid import issues)
const AdminPasswordSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true, _id: false });

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: 'BookOpen' },
  color: { type: String, default: '#1e40af' },
  examType: { type: String, default: 'General' },
}, { timestamps: true, _id: false });

const TestSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  categoryId: { type: String, required: true },
  difficulty: { type: String, default: 'medium' },
  timeLimit: { type: Number, default: 600 },
  totalQuestions: { type: Number, required: true },
  examName: { type: String, default: 'Practice Test' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, _id: false });

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  testId: { type: String, required: true },
  question: { type: String, required: true },
  questionImage: { type: String },
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  optionC: { type: String, required: true },
  optionD: { type: String, required: true },
  correctOption: { type: String, required: true },
  explanation: { type: String },
  order: { type: Number, default: 0 },
  negativeMark: { type: Number, default: 0 },
  section: { type: String, default: 'General' },
}, { timestamps: true, _id: false });

const StudentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  phone: { type: String },
  deviceId: { type: String, unique: true, sparse: true },
  freeTestsUsed: { type: Number, default: 0 },
  isSubscribed: { type: Boolean, default: false },
  subscriptionAt: { type: Date },
}, { timestamps: true, _id: false });

const TestAttemptSchema = new mongoose.Schema({
  id: { type: String, required: true },
  studentId: { type: String, required: true },
  testId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  answers: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true, _id: false });

const PaymentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  studentId: { type: String, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  currency: { type: String, default: 'INR' },
}, { timestamps: true, _id: false });

async function seed() {
  console.log('🚀 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!');

  // Drop existing collections and recreate with fresh data
  const db = mongoose.connection.db;
  const collections = ['adminpasswords', 'categories', 'tests', 'questions', 'students', 'testattempts', 'payments'];

  for (const col of collections) {
    try {
      await db!.dropCollection(col);
      console.log(`🗑️  Dropped: ${col}`);
    } catch {
      console.log(`ℹ️  Collection ${col} doesn't exist yet`);
    }
  }

  // Seed data in order (categories before tests, tests before questions, etc.)
  
  // 1. Categories
  const categoriesData = JSON.parse(readFileSync(join(dataDir, 'categories.json'), 'utf-8'));
  if (categoriesData.length > 0) {
    const CatModel = mongoose.model('Category', CategorySchema);
    await CatModel.insertMany(categoriesData);
    console.log(`✅ Seeded ${categoriesData.length} categories`);
  }

  // 2. Tests
  const testsData = JSON.parse(readFileSync(join(dataDir, 'tests.json'), 'utf-8'));
  if (testsData.length > 0) {
    const TestModel = mongoose.model('Test', TestSchema);
    await TestModel.insertMany(testsData);
    console.log(`✅ Seeded ${testsData.length} tests`);
  }

  // 3. Questions
  const questionsData = JSON.parse(readFileSync(join(dataDir, 'questions.json'), 'utf-8'));
  if (questionsData.length > 0) {
    const QuestionModel = mongoose.model('Question', QuestionSchema);
    await QuestionModel.insertMany(questionsData);
    console.log(`✅ Seeded ${questionsData.length} questions`);
  }

  // 4. Students
  const studentsData = JSON.parse(readFileSync(join(dataDir, 'students.json'), 'utf-8'));
  if (studentsData.length > 0) {
    const StudentModel = mongoose.model('Student', StudentSchema);
    await StudentModel.insertMany(studentsData);
    console.log(`✅ Seeded ${studentsData.length} students`);
  }

  // 5. TestAttempts
  const attemptsData = JSON.parse(readFileSync(join(dataDir, 'testAttempts.json'), 'utf-8'));
  if (attemptsData.length > 0) {
    const AttemptModel = mongoose.model('TestAttempt', TestAttemptSchema);
    await AttemptModel.insertMany(attemptsData);
    console.log(`✅ Seeded ${attemptsData.length} test attempts`);
  }

  // 6. Payments
  const paymentsData = JSON.parse(readFileSync(join(dataDir, 'payments.json'), 'utf-8'));
  if (paymentsData.length > 0) {
    const PaymentModel = mongoose.model('Payment', PaymentSchema);
    await PaymentModel.insertMany(paymentsData);
    console.log(`✅ Seeded ${paymentsData.length} payments`);
  }

  // 7. AdminPasswords
  const adminData = JSON.parse(readFileSync(join(dataDir, 'adminPasswords.json'), 'utf-8'));
  if (adminData.length > 0) {
    const AdminModel = mongoose.model('AdminPassword', AdminPasswordSchema);
    await AdminModel.insertMany(adminData);
    console.log(`✅ Seeded ${adminData.length} admin passwords`);
  }

  console.log('\n🎉 All data seeded to MongoDB Atlas successfully!');
  
  // Verify counts
  for (const col of collections) {
    const count = await db!.collection(col).countDocuments();
    console.log(`   📊 ${col}: ${count} documents`);
  }

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB');
}

seed().catch((e) => {
  console.error('❌ Seed error:', e);
  process.exit(1);
});
