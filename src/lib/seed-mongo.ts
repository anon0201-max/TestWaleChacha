import { dbConnect } from './mongodb';
import AdminPassword from './models/AdminPassword';
import Category from './models/Category';
import Test from './models/Test';
import Question from './models/Question';

async function seed() {
  console.log('🌱 Seeding MongoDB...');

  await dbConnect();

  // Clear existing data
  await Promise.all([
    AdminPassword.deleteMany({}).exec(),
    Category.deleteMany({}).exec(),
    Test.deleteMany({}).exec(),
    Question.deleteMany({}).exec(),
  ]);

  // Create admin
  await AdminPassword.create({ username: 'admin', password: 'admin123' });

  // Categories
  const categories = await Category.insertMany([
    { name: 'SSC CGL', slug: 'ssc-cgl', icon: 'Shield', color: '#1e40af', examType: 'SSC' },
    { name: 'UPSC', slug: 'upsc', icon: 'Landmark', color: '#7c3aed', examType: 'UPSC' },
    { name: 'Banking & IBPS', slug: 'banking-ibps', icon: 'Building2', color: '#059669', examType: 'Banking' },
    { name: 'Railways RRB', slug: 'railways-rrb', icon: 'TrainFront', color: '#dc2626', examType: 'Railways' },
    { name: 'General Knowledge', slug: 'general-knowledge', icon: 'Globe', color: '#ea580c', examType: 'General' },
    { name: 'Science & Tech', slug: 'science-tech', icon: 'Beaker', color: '#0891b2', examType: 'General' },
    { name: 'Mathematics', slug: 'mathematics', icon: 'Calculator', color: '#4f46e5', examType: 'General' },
    { name: 'English', slug: 'english', icon: 'BookOpen', color: '#0d9488', examType: 'General' },
    { name: 'Current Affairs', slug: 'current-affairs', icon: 'Newspaper', color: '#b91c1c', examType: 'General' },
    { name: 'Computer Science', slug: 'computer-science', icon: 'Monitor', color: '#c026d3', examType: 'General' },
  ]);

  // Helper to create test + questions
  async function createTest(title: string, description: string, categoryId: string, difficulty: string, timeLimit: number, examName: string, questions: any[]) {
    const test = await Test.create({ title, description, categoryId, difficulty, timeLimit, totalQuestions: questions.length, examName });
    await Question.insertMany(questions.map((q, i) => ({ ...q, testId: test._id, order: i, section: q.section || 'General' })));
    return test;
  }

  const cats = categories.map(c => c._id.toString());

  // SSC CGL - General Awareness
  await createTest('SSC CGL - General Awareness Practice Set 1', 'Practice general awareness questions asked in SSC CGL', cats[0], 'medium', 600, 'SSC CGL 2024', [
    { question: 'The Constitution of India was adopted on:', optionA: '26 January 1950', optionB: '15 August 1947', optionC: '26 November 1949', optionD: '2 October 1950', correctOption: 'C', explanation: 'The Constitution was adopted on 26 November 1949 and came into effect on 26 January 1950.' },
    { question: 'Which vitamin is produced by the human body when exposed to sunlight?', optionA: 'Vitamin A', optionB: 'Vitamin B', optionC: 'Vitamin C', optionD: 'Vitamin D', correctOption: 'D', explanation: 'Vitamin D is produced when the skin is exposed to ultraviolet B (UVB) rays from sunlight.' },
    { question: 'The Headquarters of the International Monetary Fund (IMF) is in:', optionA: 'New York', optionB: 'Geneva', optionC: 'Washington D.C.', optionD: 'Paris', correctOption: 'C', explanation: 'The IMF headquarters is located in Washington, D.C., United States.' },
    { question: 'Which planet is known as the "Morning Star"?', optionA: 'Mars', optionB: 'Venus', optionC: 'Jupiter', optionD: 'Mercury', correctOption: 'B', explanation: 'Venus is called the Morning Star (and Evening Star) because it is visible just before sunrise and after sunset.' },
    { question: 'The festival of "Baisakhi" is celebrated in which month?', optionA: 'March', optionB: 'April', optionC: 'May', optionD: 'January', correctOption: 'B', explanation: 'Baisakhi is celebrated on 13th or 14th April every year, marking the Sikh New Year.' },
  ]);

  // SSC CGL - Quantitative Aptitude
  await createTest('SSC CGL - Quantitative Aptitude Set 1', 'Practice quantitative aptitude questions for SSC CGL exam', cats[0], 'hard', 900, 'SSC CGL 2024', [
    { question: 'A train 150m long running at 72 km/h crosses a platform in 25 seconds. What is the length of the platform?', optionA: '300m', optionB: '350m', optionC: '400m', optionD: '250m', correctOption: 'B', explanation: 'Speed = 72 km/h = 20 m/s. Distance = Speed × Time = 20 × 25 = 500m. Platform length = 500 - 150 = 350m.' },
    { question: 'If the ratio of A to B is 3:5 and B to C is 4:7, then A:B:C is:', optionA: '3:5:7', optionB: '12:20:35', optionC: '12:20:28', optionD: '9:15:28', correctOption: 'B', explanation: 'A:B = 3:5 = 12:20, B:C = 4:7 = 20:35. So A:B:C = 12:20:35.' },
    { question: 'The simple interest on ₹5000 at 8% per annum for 3 years is:', optionA: '₹1000', optionB: '₹1200', optionC: '₹1500', optionD: '₹800', correctOption: 'B', explanation: 'SI = P × R × T / 100 = 5000 × 8 × 3 / 100 = ₹1200.' },
    { question: 'What is 25% of 80% of 500?', optionA: '80', optionB: '100', optionC: '120', optionD: '150', correctOption: 'B', explanation: '80% of 500 = 400. 25% of 400 = 100.' },
    { question: 'The average of 5 consecutive odd numbers is 23. The smallest number is:', optionA: '17', optionB: '19', optionC: '21', optionD: '15', correctOption: 'B', explanation: 'Average of 5 consecutive odd numbers is the middle number = 23. So numbers are 19, 21, 23, 25, 27.' },
  ]);

  // UPSC - Indian Polity
  await createTest('UPSC GS Paper - Indian Polity', 'Practice polity questions for UPSC Civil Services', cats[1], 'hard', 900, 'UPSC CSE 2024', [
    { question: 'The concept of "Basic Structure" of the Constitution was established in which case?', optionA: 'Golaknath Case', optionB: 'Kesavananda Bharati Case', optionC: 'Minerva Mills Case', optionD: 'Maneka Gandhi Case', correctOption: 'B', explanation: 'The Basic Structure doctrine was laid down in the Kesavananda Bharati v. State of Kerala (1973) case.' },
    { question: 'How many types of writs can the Supreme Court issue under Article 32?', optionA: '3', optionB: '4', optionC: '5', optionD: '6', correctOption: 'C', explanation: '5 writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto.' },
    { question: 'The Panchayati Raj system was constitutionalized by which amendment?', optionA: '71st', optionB: '72nd', optionC: '73rd', optionD: '74th', correctOption: 'C', explanation: 'The 73rd Amendment (1992) constitutionalized Panchayati Raj institutions.' },
    { question: 'Who appoints the Chief Election Commissioner of India?', optionA: 'Prime Minister', optionB: 'President', optionC: 'Parliament', optionD: 'Chief Justice of India', correctOption: 'B', explanation: 'The Chief Election Commissioner is appointed by the President of India.' },
    { question: 'Article 370 was related to:', optionA: 'Emergency provisions', optionB: 'Special status of Jammu & Kashmir', optionC: 'Right to Education', optionD: 'GST provisions', correctOption: 'B', explanation: 'Article 370 granted special autonomous status to Jammu & Kashmir.' },
  ]);

  // Banking - Reasoning
  await createTest('IBPS PO - Reasoning Ability', 'Practice reasoning and aptitude for banking exams', cats[2], 'medium', 600, 'IBPS PO 2024', [
    { question: 'In a row of 40 students, Ravi is 7th from the left and Sumit is 12th from the right. How many students are between them?', optionA: '20', optionB: '21', optionC: '22', optionD: '23', correctOption: 'B', explanation: 'Ravi position from right = 40 - 7 + 1 = 34. Students between = 34 - 12 - 1 = 21.' },
    { question: 'If APPLE is coded as ELPPA, then ORANGE is coded as:', optionA: 'EGNARO', optionB: 'ORANGE', optionC: 'EGNAR O', optionD: 'EGNAOR', correctOption: 'A', explanation: 'The word is reversed. ORANGE → EGNARO.' },
    { question: 'A is B\'s brother. C is A\'s mother. D is C\'s father. How is B related to D?', optionA: 'Grandson', optionB: 'Granddaughter', optionC: 'Grandson or Granddaughter', optionD: 'Son', correctOption: 'C', explanation: 'D is grandfather of A. Since A and B are siblings, B is D\'s grandchild.' },
    { question: 'Find the odd one out: 2, 5, 10, 17, 28, 41', optionA: '10', optionB: '28', optionC: '41', optionD: '17', correctOption: 'B', explanation: 'Pattern: +3, +5, +7, +9, +11. 28 should be 27.' },
    { question: 'Complete the series: 3, 6, 18, 72, ?', optionA: '144', optionB: '216', optionC: '288', optionD: '360', correctOption: 'D', explanation: 'Pattern: ×2, ×3, ×4, ×5. So 72 × 5 = 360.' },
  ]);

  // Railways - General Science
  await createTest('RRB NTPC - General Science', 'General science questions for Railway recruitment exam', cats[3], 'easy', 300, 'RRB NTPC 2024', [
    { question: 'The pH of human blood is approximately:', optionA: '6.4', optionB: '7.0', optionC: '7.4', optionD: '8.0', correctOption: 'C', explanation: 'Normal human blood pH is approximately 7.35-7.45.' },
    { question: 'Which gas is commonly used in electric bulbs?', optionA: 'Oxygen', optionB: 'Nitrogen', optionC: 'Argon', optionD: 'Carbon dioxide', correctOption: 'C', explanation: 'Argon is used as filling gas in incandescent light bulbs.' },
    { question: 'The chemical formula of baking soda is:', optionA: 'NaCl', optionB: 'NaHCO₃', optionC: 'Na₂CO₃', optionD: 'NaOH', correctOption: 'B', explanation: 'Baking soda is Sodium Bicarbonate (NaHCO₃).' },
    { question: 'The hardest naturally occurring substance is:', optionA: 'Platinum', optionB: 'Iron', optionC: 'Diamond', optionD: 'Gold', correctOption: 'C', explanation: 'Diamond is the hardest known natural material.' },
    { question: 'Which part of the body produces insulin?', optionA: 'Liver', optionB: 'Kidney', optionC: 'Pancreas', optionD: 'Stomach', correctOption: 'C', explanation: 'Insulin is produced by the beta cells of the pancreas.' },
  ]);

  // General Knowledge
  await createTest('General Knowledge - India & World', 'Mix of Indian and world GK questions', cats[4], 'medium', 480, 'Practice Set', [
    { question: 'What is the national animal of India?', optionA: 'Lion', optionB: 'Tiger', optionC: 'Elephant', optionD: 'Leopard', correctOption: 'B', explanation: 'The Bengal Tiger is the national animal of India.' },
    { question: 'Which country has the largest population in the world (2024)?', optionA: 'China', optionB: 'India', optionC: 'USA', optionD: 'Indonesia', correctOption: 'B', explanation: 'India surpassed China in 2023 to become the world\'s most populous country.' },
    { question: 'World Environment Day is celebrated on:', optionA: '22 April', optionB: '5 June', optionC: '21 March', optionD: '16 September', correctOption: 'B', explanation: 'World Environment Day is celebrated annually on 5 June.' },
    { question: 'Who was the first Indian to go to space?', optionA: 'Kalpana Chawla', optionB: 'Rakesh Sharma', optionC: 'Sunita Williams', optionD: 'APJ Abdul Kalam', correctOption: 'B', explanation: 'Wing Commander Rakesh Sharma was the first Indian citizen to travel to space in 1984.' },
    { question: 'The headquarters of ISRO is in:', optionA: 'Mumbai', optionB: 'Chennai', optionC: 'Bengaluru', optionD: 'Hyderabad', correctOption: 'C', explanation: 'ISRO is headquartered in Bengaluru, Karnataka.' },
  ]);

  // Science & Tech
  await createTest('Physics - Mechanics & Motion', 'Test your physics fundamentals', cats[5], 'medium', 480, 'Practice Set', [
    { question: 'Newton\'s third law of motion states:', optionA: 'Every object remains at rest unless acted upon', optionB: 'Force equals mass times acceleration', optionC: 'Every action has an equal and opposite reaction', optionD: 'Energy cannot be created or destroyed', correctOption: 'C', explanation: 'Newton\'s Third Law: For every action, there is an equal and opposite reaction.' },
    { question: 'The SI unit of power is:', optionA: 'Joule', optionB: 'Newton', optionC: 'Watt', optionD: 'Pascal', correctOption: 'C', explanation: 'The Watt (W) is the SI unit of power.' },
    { question: 'What is the escape velocity from Earth?', optionA: '9.8 km/s', optionB: '11.2 km/s', optionC: '7.9 km/s', optionD: '15.0 km/s', correctOption: 'B', explanation: 'The escape velocity from Earth is approximately 11.2 km/s.' },
    { question: 'Sound waves are:', optionA: 'Transverse', optionB: 'Longitudinal', optionC: 'Electromagnetic', optionD: 'None', correctOption: 'B', explanation: 'Sound waves are longitudinal waves.' },
    { question: 'The boiling point of water at standard atmospheric pressure is:', optionA: '90°C', optionB: '100°C', optionC: '110°C', optionD: '120°C', correctOption: 'B', explanation: 'Water boils at 100°C at standard atmospheric pressure.' },
  ]);

  // Mathematics
  await createTest('Speed Math & Simplification', 'Quick calculation practice', cats[6], 'easy', 180, 'Practice Set', [
    { question: 'What is 23 × 17?', optionA: '371', optionB: '391', optionC: '411', optionD: '361', correctOption: 'B', explanation: '23 × 17 = 391.' },
    { question: 'What is 15% of 600?', optionA: '80', optionB: '85', optionC: '90', optionD: '95', correctOption: 'C', explanation: '15% of 600 = 90.' },
    { question: 'What is √(625)?', optionA: '20', optionB: '25', optionC: '30', optionD: '35', correctOption: 'B', explanation: '√625 = 25.' },
    { question: 'What is 2⁸?', optionA: '128', optionB: '256', optionC: '512', optionD: '64', correctOption: 'B', explanation: '2⁸ = 256.' },
    { question: 'What is 16 × 16?', optionA: '246', optionB: '256', optionC: '266', optionD: '236', correctOption: 'B', explanation: '16 × 16 = 256.' },
  ]);

  // English
  await createTest('English - Error Spotting & Grammar', 'Find errors in English sentences', cats[7], 'medium', 360, 'Practice Set', [
    { question: 'Find the error: "She don\'t like coffee."', optionA: 'She', optionB: 'don\'t', optionC: 'like', optionD: 'coffee', correctOption: 'B', explanation: '"don\'t" should be "doesn\'t" for third-person singular.' },
    { question: 'Choose the correctly spelled word:', optionA: 'Accomodate', optionB: 'Accomodate', optionC: 'Accommodate', optionD: 'Acommodate', correctOption: 'C', explanation: 'The correct spelling is "Accommodate".' },
    { question: '"He is _____ honest man." Fill in:', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'no article', correctOption: 'B', explanation: '"an" is used before vowel sounds. "Honest" starts with a vowel sound.' },
    { question: 'The synonym of "Benevolent" is:', optionA: 'Cruel', optionB: 'Kind', optionC: 'Angry', optionD: 'Rich', correctOption: 'B', explanation: 'Benevolent means kind and generous.' },
    { question: 'Which is the plural of "child"?', optionA: 'Childs', optionB: 'Childes', optionC: 'Children', optionD: 'Child\'s', correctOption: 'C', explanation: 'The plural of "child" is "children".' },
  ]);

  // Current Affairs
  await createTest('Current Affairs 2024', 'Latest events and news', cats[8], 'medium', 360, 'Monthly Update', [
    { question: 'Which country hosted the G20 Summit in 2023?', optionA: 'Indonesia', optionB: 'India', optionC: 'Brazil', optionD: 'Japan', correctOption: 'B', explanation: 'India hosted the G20 Summit in September 2023.' },
    { question: 'Chandrayaan-3 successfully landed on the Moon\'s:', optionA: 'North Pole', optionB: 'South Pole', optionC: 'Equator', optionD: 'Far Side', correctOption: 'B', explanation: 'Chandrayaan-3 landed near the Moon\'s south pole on August 23, 2023.' },
    { question: 'The new name of Rajpath in New Delhi is:', optionA: 'Sardar Patel Marg', optionB: 'Kartavya Path', optionC: 'Shanti Path', optionD: 'Janpath', correctOption: 'B', explanation: 'Rajpath was renamed to Kartavya Path in September 2022.' },
    { question: 'Which state became India\'s 28th state in 2000?', optionA: 'Jharkhand', optionB: 'Uttarakhand', optionC: 'Chhattisgarh', optionD: 'Telangana', correctOption: 'A', explanation: 'Jharkhand became India\'s 28th state on November 15, 2000.' },
    { question: 'What is India\'s rank in terms of GDP (PPP) globally?', optionA: '2nd', optionB: '3rd', optionC: '4th', optionD: '5th', correctOption: 'B', explanation: 'India is the 3rd largest economy by GDP (PPP).' },
  ]);

  // Computer Science
  await createTest('Computer Fundamentals', 'Basic computer science for competitive exams', cats[9], 'easy', 300, 'Practice Set', [
    { question: '1 Gigabyte (GB) equals:', optionA: '1000 MB', optionB: '1024 MB', optionC: '1048 MB', optionD: '512 MB', correctOption: 'B', explanation: '1 GB = 1024 MB in binary system.' },
    { question: 'The full form of CPU is:', optionA: 'Central Processing Unit', optionB: 'Computer Personal Unit', optionC: 'Central Program Utility', optionD: 'Core Processing Unit', correctOption: 'A', explanation: 'CPU stands for Central Processing Unit.' },
    { question: 'Which is the fastest memory in a computer?', optionA: 'Hard Disk', optionB: 'RAM', optionC: 'Cache Memory', optionD: 'ROM', correctOption: 'C', explanation: 'Cache memory is the fastest memory.' },
    { question: 'HTTP stands for:', optionA: 'HyperText Transfer Protocol', optionB: 'High Tech Transfer Protocol', optionC: 'HyperText Transmission Protocol', optionD: 'Home Tool Transfer Protocol', correctOption: 'A', explanation: 'HTTP stands for HyperText Transfer Protocol.' },
    { question: 'A firewall is used for:', optionA: 'Data storage', optionB: 'Network security', optionC: 'Word processing', optionD: 'Email sending', correctOption: 'B', explanation: 'A firewall monitors and controls network traffic for security.' },
  ]);

  console.log('✅ Seeding completed!');
  console.log(`📊 10 categories with ${categories.length} tests created.`);
}

seed().catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); });
