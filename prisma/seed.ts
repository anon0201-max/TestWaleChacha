import { db } from '../src/lib/db';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin password
  await db.adminPassword.create({
    data: { username: 'admin', password: 'admin123' },
  });

  // Categories mapped to government exam types
  const categories = await Promise.all([
    db.category.create({ data: { name: 'SSC CGL', slug: 'ssc-cgl', icon: 'Shield', color: '#1e40af', examType: 'SSC' } }),
    db.category.create({ data: { name: 'UPSC', slug: 'upsc', icon: 'Landmark', color: '#7c3aed', examType: 'UPSC' } }),
    db.category.create({ data: { name: 'Banking & IBPS', slug: 'banking-ibps', icon: 'Building2', color: '#059669', examType: 'Banking' } }),
    db.category.create({ data: { name: 'Railways RRB', slug: 'railways-rrb', icon: 'TrainFront', color: '#dc2626', examType: 'Railways' } }),
    db.category.create({ data: { name: 'General Knowledge', slug: 'general-knowledge', icon: 'Globe', color: '#ea580c', examType: 'General' } }),
    db.category.create({ data: { name: 'Science & Tech', slug: 'science-tech', icon: 'Beaker', color: '#0891b2', examType: 'General' } }),
    db.category.create({ data: { name: 'Mathematics', slug: 'mathematics', icon: 'Calculator', color: '#4f46e5', examType: 'General' } }),
    db.category.create({ data: { name: 'English', slug: 'english', icon: 'BookOpen', color: '#0d9488', examType: 'General' } }),
    db.category.create({ data: { name: 'Current Affairs', slug: 'current-affairs', icon: 'Newspaper', color: '#b91c1c', examType: 'General' } }),
    db.category.create({ data: { name: 'Computer Science', slug: 'computer-science', icon: 'Monitor', color: '#c026d3', examType: 'General' } }),
  ]);

  // Helper
  async function createTest(title: string, description: string, categoryId: string, difficulty: string, timeLimit: number, examName: string, questions: { question: string; optionA: string; optionB: string; optionC: string; optionD: string; correctOption: string; explanation: string; section?: string }[]) {
    return db.test.create({
      data: { title, description, categoryId, difficulty, timeLimit, totalQuestions: questions.length, examName, questions: { create: questions.map((q, i) => ({ ...q, order: i, section: q.section || 'General' })) } },
    });
  }

  // ===== SSC CGL TESTS =====
  await createTest('SSC CGL - General Awareness Practice Set 1', 'Practice general awareness questions asked in SSC CGL', categories[0].id, 'medium', 600, 'SSC CGL 2024', [
    { question: 'The Constitution of India was adopted on:', optionA: '26 January 1950', optionB: '15 August 1947', optionC: '26 November 1949', optionD: '2 October 1950', correctOption: 'C', explanation: 'The Constitution was adopted on 26 November 1949 and came into effect on 26 January 1950.' },
    { question: 'Which vitamin is produced by the human body when exposed to sunlight?', optionA: 'Vitamin A', optionB: 'Vitamin B', optionC: 'Vitamin C', optionD: 'Vitamin D', correctOption: 'D', explanation: 'Vitamin D is produced when the skin is exposed to ultraviolet B (UVB) rays from sunlight.' },
    { question: 'The Headquarters of the International Monetary Fund (IMF) is in:', optionA: 'New York', optionB: 'Geneva', optionC: 'Washington D.C.', optionD: 'Paris', correctOption: 'C', explanation: 'The IMF headquarters is located in Washington, D.C., United States.' },
    { question: 'Which planet is known as the "Morning Star"?', optionA: 'Mars', optionB: 'Venus', optionC: 'Jupiter', optionD: 'Mercury', correctOption: 'B', explanation: 'Venus is called the Morning Star (and Evening Star) because it is visible just before sunrise and after sunset.' },
    { question: 'The festival of "Baisakhi" is celebrated in which month?', optionA: 'March', optionB: 'April', optionC: 'May', optionD: 'January', correctOption: 'B', explanation: 'Baisakhi is celebrated on 13th or 14th April every year, marking the Sikh New Year.' },
    { question: 'Who wrote the book "Discovery of India"?', optionA: 'Jawaharlal Nehru', optionB: 'Mahatma Gandhi', optionC: 'Sardar Patel', optionD: 'Rabindranath Tagore', correctOption: 'A', explanation: 'Jawaharlal Nehru wrote "The Discovery of India" during his imprisonment in 1942-46.' },
    { question: 'The chemical name of Vitamin C is:', optionA: 'Ascorbic Acid', optionB: 'Citric Acid', optionC: 'Folic Acid', optionD: 'Retinol', correctOption: 'A', explanation: 'Vitamin C is scientifically known as Ascorbic Acid.' },
    { question: 'Which river is known as the "Sorrow of Bihar"?', optionA: 'Ganga', optionB: 'Yamuna', optionC: 'Kosi', optionD: 'Son', correctOption: 'C', explanation: 'The Kosi river is called the "Sorrow of Bihar" due to its frequent devastating floods.' },
    { question: 'The first Indian satellite was:', optionA: 'Bhaskara', optionB: 'Aryabhata', optionC: 'INSAT-1A', optionD: 'Rohini', correctOption: 'B', explanation: 'Aryabhata was India\'s first satellite, launched on 19 April 1975.' },
    { question: 'The currency of Japan is:', optionA: 'Won', optionB: 'Yuan', optionC: 'Yen', optionD: 'Ringgit', correctOption: 'C', explanation: 'The Japanese Yen (¥) is the official currency of Japan.' },
  ]);

  await createTest('SSC CGL - Quantitative Aptitude Set 1', 'Practice quantitative aptitude questions for SSC CGL exam', categories[0].id, 'hard', 900, 'SSC CGL 2024', [
    { question: 'A train 150m long running at 72 km/h crosses a platform in 25 seconds. What is the length of the platform?', optionA: '300m', optionB: '350m', optionC: '400m', optionD: '250m', correctOption: 'B', explanation: 'Speed = 72 km/h = 20 m/s. Distance = Speed × Time = 20 × 25 = 500m. Platform length = 500 - 150 = 350m.' },
    { question: 'If the ratio of A to B is 3:5 and B to C is 4:7, then A:B:C is:', optionA: '3:5:7', optionB: '12:20:35', optionC: '12:20:28', optionD: '9:15:28', correctOption: 'B', explanation: 'A:B = 3:5 = 12:20, B:C = 4:7 = 20:35. So A:B:C = 12:20:35.' },
    { question: 'The simple interest on ₹5000 at 8% per annum for 3 years is:', optionA: '₹1000', optionB: '₹1200', optionC: '₹1500', optionD: '₹800', correctOption: 'B', explanation: 'SI = P × R × T / 100 = 5000 × 8 × 3 / 100 = ₹1200.' },
    { question: 'What is 25% of 80% of 500?', optionA: '80', optionB: '100', optionC: '120', optionD: '150', correctOption: 'B', explanation: '80% of 500 = 400. 25% of 400 = 100.' },
    { question: 'A can do a work in 15 days and B can do it in 10 days. They work together for 4 days, then B leaves. In how many days will A complete the remaining work?', optionA: '5 days', optionB: '6 days', optionC: '7 days', optionD: '8 days', correctOption: 'C', explanation: 'A\'s rate = 1/15, B\'s rate = 1/10. Together = 1/15 + 1/10 = 1/6. In 4 days = 4/6 = 2/3 done. Remaining = 1/3. A takes (1/3)/(1/15) = 5 days.' },
    { question: 'The average of 5 consecutive odd numbers is 23. The smallest number is:', optionA: '17', optionB: '19', optionC: '21', optionD: '15', correctOption: 'B', explanation: 'Average of 5 consecutive odd numbers is the middle number = 23. So numbers are 19, 21, 23, 25, 27.' },
    { question: 'If x + 1/x = 5, then x² + 1/x² = ?', optionA: '23', optionB: '25', optionC: '27', optionD: '21', correctOption: 'A', explanation: '(x + 1/x)² = x² + 2 + 1/x² = 25. So x² + 1/x² = 23.' },
    { question: 'A shopkeeper gives a discount of 20% and still makes a profit of 25%. If the cost price is ₹500, find the marked price.', optionA: '₹625', optionB: '₹750', optionC: '₹800', optionD: '₹781.25', correctOption: 'D', explanation: 'SP = 500 × 1.25 = ₹625. MP × 0.80 = 625. MP = 625/0.80 = ₹781.25.' },
    { question: 'How many prime numbers are between 1 and 50?', optionA: '14', optionB: '15', optionC: '16', optionD: '17', correctOption: 'B', explanation: 'Primes: 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47 = 15 primes.' },
    { question: 'If the radius of a circle is increased by 20%, its area increases by:', optionA: '20%', optionB: '40%', optionC: '44%', optionD: '48%', correctOption: 'C', explanation: 'Area ∝ r². If r increases by 20%, new area = 1.2² = 1.44 times. Increase = 44%.' },
  ]);

  // ===== UPSC TESTS =====
  await createTest('UPSC GS Paper - Indian Polity', 'Practice polity questions for UPSC Civil Services', categories[1].id, 'hard', 900, 'UPSC CSE 2024', [
    { question: 'The concept of "Basic Structure" of the Constitution was established in which case?', optionA: 'Golaknath Case', optionB: 'Kesavananda Bharati Case', optionC: 'Minerva Mills Case', optionD: 'Maneka Gandhi Case', correctOption: 'B', explanation: 'The Basic Structure doctrine was laid down in the Kesavananda Bharati v. State of Kerala (1973) case.' },
    { question: 'How many types of writs can the Supreme Court issue under Article 32?', optionA: '3', optionB: '4', optionC: '5', optionD: '6', correctOption: 'C', explanation: '5 writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo Warranto.' },
    { question: 'The Panchayati Raj system was constitutionalized by which amendment?', optionA: '71st', optionB: '72nd', optionC: '73rd', optionD: '74th', correctOption: 'C', explanation: 'The 73rd Amendment (1992) constitutionalized Panchayati Raj institutions. The 74th did the same for municipalities.' },
    { question: 'Who appoints the Chief Election Commissioner of India?', optionA: 'Prime Minister', optionB: 'President', optionC: 'Parliament', optionD: 'Chief Justice of India', correctOption: 'B', explanation: 'The Chief Election Commissioner is appointed by the President of India.' },
    { question: 'Article 370 was related to:', optionA: 'Emergency provisions', optionB: 'Special status of Jammu & Kashmir', optionC: 'Right to Education', optionD: 'GST provisions', correctOption: 'B', explanation: 'Article 370 granted special autonomous status to Jammu & Kashmir. It was abrogated in August 2019.' },
    { question: 'The concept of "Directive Principles of State Policy" is borrowed from which constitution?', optionA: 'USA', optionB: 'UK', optionC: 'Ireland', optionD: 'France', correctOption: 'C', explanation: 'Directive Principles are borrowed from the Irish Constitution.' },
    { question: 'How many members are nominated by the President to the Rajya Sabha?', optionA: '10', optionB: '12', optionC: '14', optionD: '16', correctOption: 'B', explanation: 'The President nominates 12 members to Rajya Sabha from fields of literature, science, art, and social service.' },
    { question: 'The "Right to Property" was removed from Fundamental Rights by which amendment?', optionA: '42nd', optionB: '43rd', optionC: '44th', optionD: '45th', correctOption: 'C', explanation: 'The 44th Amendment (1978) removed the Right to Property from Fundamental Rights and made it a legal right under Article 300A.' },
    { question: 'Which schedule of the Constitution deals with the Anti-Defection Law?', optionA: '8th', optionB: '9th', optionC: '10th', optionD: '11th', correctOption: 'C', explanation: 'The 10th Schedule (added by 52nd Amendment) contains provisions of the Anti-Defection Law.' },
    { question: 'The quorum required for a meeting of the Lok Sabha is:', optionA: '1/3rd of total membership', optionB: '1/4th of total membership', optionC: '1/5th of total membership', optionD: '1/10th of total membership', correctOption: 'D', explanation: 'The quorum of the Lok Sabha is 1/10th of the total membership (55 members).' },
  ]);

  // ===== BANKING TESTS =====
  await createTest('IBPS PO - Reasoning Ability', 'Practice reasoning and aptitude for banking exams', categories[2].id, 'medium', 600, 'IBPS PO 2024', [
    { question: 'In a row of 40 students, Ravi is 7th from the left and Sumit is 12th from the right. How many students are between them?', optionA: '20', optionB: '21', optionC: '22', optionD: '23', correctOption: 'B', explanation: 'Ravi position from right = 40 - 7 + 1 = 34. Students between = 34 - 12 - 1 = 21.' },
    { question: 'If APPLE is coded as ELPPA, then ORANGE is coded as:', optionA: 'EGNARO', optionB: 'ORANG E', optionC: 'EGNAR O', optionD: 'EGNAOR', correctOption: 'A', explanation: 'The word is reversed. ORANGE → EGNARO.' },
    { question: 'A is B\'s brother. C is A\'s mother. D is C\'s father. How is B related to D?', optionA: 'Grandson', optionB: 'Granddaughter', optionC: 'Grandson or Granddaughter', optionD: 'Son', correctOption: 'C', explanation: 'D is grandfather of A. Since A and B are siblings (brother), B is D\'s grandchild (gender not specified).' },
    { question: 'Find the odd one out: 2, 5, 10, 17, 28, 41', optionA: '10', optionB: '28', optionC: '41', optionD: '17', correctOption: 'B', explanation: 'Pattern: +3, +5, +7, +9, +11. Differences: 3,5,7,11,13. 28 should be 27 (17+10=27, not 28).' },
    { question: 'If SOUTH is coded as 5392, what is the code for NORTH?', optionA: '47628', optionB: '46728', optionC: '46782', optionD: '47682', correctOption: 'B', explanation: 'Each letter coded: S=5,O=3,U=9,T=2,H=8. N=4,O=3,R=7,T=2,H=8. NORTH = 46728.' },
    { question: 'Pointing to a man, a woman said "His mother is the only daughter of my mother." How is the woman related to the man?', optionA: 'Mother', optionB: 'Daughter', optionC: 'Sister', optionD: 'Grandmother', correctOption: 'A', explanation: '"Only daughter of my mother" = the woman herself. So man\'s mother = the woman. She is his mother.' },
    { question: 'Complete the series: 3, 6, 18, 72, ?', optionA: '144', optionB: '216', optionC: '288', optionD: '360', correctOption: 'D', explanation: 'Pattern: ×2, ×3, ×4, ×5. So 72 × 5 = 360.' },
    { question: 'If all roses are flowers and some flowers fade quickly, then:', optionA: 'All roses fade quickly', optionB: 'Some roses fade quickly', optionC: 'No roses fade quickly', optionD: 'Some roses may fade quickly', correctOption: 'D', explanation: 'Since some flowers fade quickly and all roses are flowers, it\'s possible some roses fade quickly but not certain.' },
    { question: 'In a certain code "PEN" is written as "QFO". How will "CAT" be written?', optionA: 'DBU', optionB: 'DCA', optionC: 'BAU', optionD: 'BCU', correctOption: 'A', explanation: 'Each letter shifted by +1: P→Q, E→F, N→O. So C→D, A→B, T→U = DBU.' },
    { question: 'A clock shows 3:15. What is the angle between the hour and minute hands?', optionA: '0°', optionB: '7.5°', optionC: '15°', optionD: '22.5°', correctOption: 'B', explanation: 'At 3:15, hour hand = 3×30 + 15×0.5 = 97.5°. Minute hand = 15×6 = 90°. Angle = 7.5°.' },
  ]);

  // ===== RAILWAYS TESTS =====
  await createTest('RRB NTPC - General Science', 'General science questions for Railway recruitment exam', categories[3].id, 'easy', 300, 'RRB NTPC 2024', [
    { question: 'The pH of human blood is approximately:', optionA: '6.4', optionB: '7.0', optionC: '7.4', optionD: '8.0', correctOption: 'C', explanation: 'Normal human blood pH is approximately 7.35-7.45 (slightly alkaline).' },
    { question: 'Which gas is commonly used in electric bulbs?', optionA: 'Oxygen', optionB: 'Nitrogen', optionC: 'Argon', optionD: 'Carbon dioxide', correctOption: 'C', explanation: 'Argon (or a mixture of Argon and Nitrogen) is used as filling gas in incandescent light bulbs.' },
    { question: 'The chemical formula of baking soda is:', optionA: 'NaCl', optionB: 'NaHCO₃', optionC: 'Na₂CO₃', optionD: 'NaOH', correctOption: 'B', explanation: 'Baking soda is Sodium Bicarbonate (NaHCO₃).' },
    { question: 'The hardest naturally occurring substance is:', optionA: 'Platinum', optionB: 'Iron', optionC: 'Diamond', optionD: 'Gold', correctOption: 'C', explanation: 'Diamond (made of carbon) is the hardest known natural material.' },
    { question: 'Which part of the body produces insulin?', optionA: 'Liver', optionB: 'Kidney', optionC: 'Pancreas', optionD: 'Stomach', correctOption: 'C', explanation: 'Insulin is produced by the beta cells of the Islets of Langerhans in the pancreas.' },
    { question: 'The unit of electric resistance is:', optionA: 'Ampere', optionB: 'Volt', optionC: 'Ohm', optionD: 'Watt', correctOption: 'C', explanation: 'The SI unit of electrical resistance is the Ohm (Ω).' },
    { question: 'The process of photosynthesis takes place in:', optionA: 'Roots', optionB: 'Stem', optionC: 'Leaves', optionD: 'Flowers', correctOption: 'C', explanation: 'Photosynthesis primarily takes place in the leaves, specifically in the chloroplasts of mesophyll cells.' },
    { question: 'Sound cannot travel through:', optionA: 'Air', optionB: 'Water', optionC: 'Steel', optionD: 'Vacuum', correctOption: 'D', explanation: 'Sound needs a medium (solid, liquid, or gas) to travel. It cannot travel through vacuum.' },
    { question: 'The normal body temperature of a human is:', optionA: '36.5°C', optionB: '37°C', optionC: '38°C', optionD: '35°C', correctOption: 'B', explanation: 'Normal human body temperature is approximately 37°C (98.6°F).' },
    { question: 'Which organ purifies blood in the human body?', optionA: 'Heart', optionB: 'Liver', optionC: 'Kidney', optionD: 'Lungs', correctOption: 'C', explanation: 'Kidneys filter and purify blood, removing waste products and excess water to form urine.' },
  ]);

  // ===== GENERAL KNOWLEDGE =====
  await createTest('General Knowledge - India & World', 'Mix of Indian and world GK questions', categories[4].id, 'medium', 480, 'Practice Set', [
    { question: 'What is the national animal of India?', optionA: 'Lion', optionB: 'Tiger', optionC: 'Elephant', optionD: 'Leopard', correctOption: 'B', explanation: 'The Bengal Tiger (Panthera tigris tigris) is the national animal of India.' },
    { question: 'Which country has the largest population in the world (2024)?', optionA: 'China', optionB: 'India', optionC: 'USA', optionD: 'Indonesia', correctOption: 'B', explanation: 'India surpassed China in 2023 to become the world\'s most populous country.' },
    { question: 'The longest railway platform in India is at:', optionA: 'New Delhi', optionB: 'Howrah', optionC: 'Hubli', optionD: 'Kharagpur', correctOption: 'C', explanation: 'Hubli Junction in Karnataka has the longest railway platform in India (1,505 m).' },
    { question: 'World Environment Day is celebrated on:', optionA: '22 April', optionB: '5 June', optionC: '21 March', optionD: '16 September', correctOption: 'B', explanation: 'World Environment Day is celebrated annually on 5 June.' },
    { question: 'The currency of Bangladesh is:', optionA: 'Rupee', optionB: 'Taka', optionC: 'Rupiah', optionD: 'Kyat', correctOption: 'B', explanation: 'The Bangladeshi Taka (৳) is the official currency of Bangladesh.' },
    { question: 'Who was the first Indian to go to space?', optionA: 'Kalpana Chawla', optionB: 'Rakesh Sharma', optionC: 'Sunita Williams', optionD: 'APJ Abdul Kalam', correctOption: 'B', explanation: 'Wing Commander Rakesh Sharma was the first Indian citizen to travel to space in 1984 aboard Soyuz T-11.' },
    { question: 'The headquarters of ISRO is in:', optionA: 'Mumbai', optionB: 'Chennai', optionC: 'Bengaluru', optionD: 'Hyderabad', correctOption: 'C', explanation: 'The Indian Space Research Organisation (ISRO) is headquartered in Bengaluru, Karnataka.' },
    { question: 'Which vitamin prevents scurvy?', optionA: 'Vitamin A', optionB: 'Vitamin B', optionC: 'Vitamin C', optionD: 'Vitamin K', correctOption: 'C', explanation: 'Vitamin C (Ascorbic Acid) deficiency causes scurvy.' },
    { question: 'The largest desert in India is:', optionA: 'Thar Desert', optionB: 'Rann of Kutch', optionC: 'Deccan Plateau', optionD: 'Sundarbans', correctOption: 'A', explanation: 'The Thar Desert (Great Indian Desert) is the largest desert in India, spanning across Rajasthan.' },
    { question: 'India\'s first nuclear power plant was established at:', optionA: 'Tarapur', optionB: 'Kalpakkam', optionC: 'Rawatbhata', optionD: 'Narora', correctOption: 'A', explanation: 'India\'s first nuclear power plant was established at Tarapur, Maharashtra, in 1969.' },
  ]);

  // ===== SCIENCE =====
  await createTest('Physics - Mechanics & Motion', 'Test your physics fundamentals', categories[5].id, 'medium', 480, 'Practice Set', [
    { question: 'Newton\'s third law of motion states:', optionA: 'Every object remains at rest unless acted upon', optionB: 'Force equals mass times acceleration', optionC: 'Every action has an equal and opposite reaction', optionD: 'Energy cannot be created or destroyed', correctOption: 'C', explanation: 'Newton\'s Third Law: For every action, there is an equal and opposite reaction.' },
    { question: 'The SI unit of power is:', optionA: 'Joule', optionB: 'Newton', optionC: 'Watt', optionD: 'Pascal', correctOption: 'C', explanation: 'The Watt (W) is the SI unit of power, equal to one Joule per second.' },
    { question: 'What is the escape velocity from Earth?', optionA: '9.8 km/s', optionB: '11.2 km/s', optionC: '7.9 km/s', optionD: '15.0 km/s', correctOption: 'B', explanation: 'The escape velocity from Earth\'s surface is approximately 11.2 km/s.' },
    { question: 'A convex lens is used to correct:', optionA: 'Myopia', optionB: 'Hypermetropia', optionC: 'Presbyopia', optionD: 'Astigmatism', correctOption: 'B', explanation: 'Convex lenses converge light and are used to correct hypermetropia (farsightedness).' },
    { question: 'The weight of a body is maximum at:', optionA: 'Equator', optionB: 'Poles', optionC: 'Center of Earth', optionD: 'Same everywhere', correctOption: 'B', explanation: 'Weight = mg. g is maximum at the poles due to the oblate shape of Earth and no centrifugal effect.' },
    { question: 'Which type of energy is stored in a stretched spring?', optionA: 'Kinetic', optionB: 'Thermal', optionC: 'Potential', optionD: 'Chemical', correctOption: 'C', explanation: 'Elastic potential energy is stored in a deformed (stretched or compressed) spring.' },
    { question: 'The phenomenon of total internal reflection occurs when light travels from:', optionA: 'Rarer to denser medium', optionB: 'Denser to rarer medium', optionC: 'Vacuum to medium', optionD: 'Any medium to vacuum', correctOption: 'B', explanation: 'Total internal reflection occurs when light travels from a denser to a rarer medium at an angle greater than the critical angle.' },
    { question: 'What is the unit of frequency?', optionA: 'Hertz', optionB: 'Watt', optionC: 'Pascal', optionD: 'Newton', correctOption: 'A', explanation: 'The Hertz (Hz) is the SI unit of frequency, equal to one cycle per second.' },
    { question: 'Sound waves are:', optionA: 'Transverse', optionB: 'Longitudinal', optionC: 'Electromagnetic', optionD: 'None', correctOption: 'B', explanation: 'Sound waves are longitudinal waves where particles vibrate parallel to the direction of wave propagation.' },
    { question: 'The boiling point of water at standard atmospheric pressure is:', optionA: '90°C', optionB: '100°C', optionC: '110°C', optionD: '120°C', correctOption: 'B', explanation: 'Water boils at 100°C (212°F) at standard atmospheric pressure (1 atm).' },
  ]);

  // ===== MATH =====
  await createTest('Speed Math & Simplification', 'Quick calculation practice', categories[6].id, 'easy', 180, 'Practice Set', [
    { question: 'What is 23 × 17?', optionA: '371', optionB: '391', optionC: '411', optionD: '361', correctOption: 'B', explanation: '23 × 17 = 391.' },
    { question: 'What is 789 + 456?', optionA: '1145', optionB: '1245', optionC: '1345', optionD: '1235', correctOption: 'B', explanation: '789 + 456 = 1245.' },
    { question: 'What is 1000 - 457?', optionA: '533', optionB: '543', optionC: '553', optionD: '563', correctOption: 'B', explanation: '1000 - 457 = 543.' },
    { question: 'What is 15% of 600?', optionA: '80', optionB: '85', optionC: '90', optionD: '95', correctOption: 'C', explanation: '15% of 600 = (15/100) × 600 = 90.' },
    { question: 'What is 144 ÷ 12?', optionA: '10', optionB: '11', optionC: '12', optionD: '13', correctOption: 'C', explanation: '144 ÷ 12 = 12.' },
    { question: 'What is 2⁸?', optionA: '128', optionB: '256', optionC: '512', optionD: '64', correctOption: 'B', explanation: '2⁸ = 256.' },
    { question: 'What is √(625)?', optionA: '20', optionB: '25', optionC: '30', optionD: '35', correctOption: 'B', explanation: '√625 = 25 (since 25 × 25 = 625).' },
    { question: 'What is 999 + 999?', optionA: '1998', optionB: '1898', optionC: '2008', optionD: '1888', correctOption: 'A', explanation: '999 + 999 = 1998.' },
    { question: 'What is half of 384?', optionA: '182', optionB: '192', optionC: '172', optionD: '202', correctOption: 'B', explanation: '384 ÷ 2 = 192.' },
    { question: 'What is 16 × 16?', optionA: '246', optionB: '256', optionC: '266', optionD: '236', correctOption: 'B', explanation: '16 × 16 = 256.' },
  ]);

  // ===== ENGLISH =====
  await createTest('English - Error Spotting & Grammar', 'Find errors in English sentences', categories[7].id, 'medium', 360, 'Practice Set', [
    { question: 'Find the error: "She don\'t like coffee."', optionA: 'She', optionB: 'don\'t', optionC: 'like', optionD: 'coffee', correctOption: 'B', explanation: '"don\'t" should be "doesn\'t" because the subject is third-person singular.' },
    { question: 'Choose the correctly spelled word:', optionA: 'Accomodate', optionB: 'Accomodate', optionC: 'Accommodate', optionD: 'Acommodate', correctOption: 'C', explanation: 'The correct spelling is "Accommodate" (double c, double m).' },
    { question: '"He is _____ honest man." Fill in the blank:', optionA: 'a', optionB: 'an', optionC: 'the', optionD: 'no article', correctOption: 'B', explanation: '"an" is used before words beginning with a vowel sound. "Honest" starts with a vowel sound (silent h).' },
    { question: 'The synonym of "Benevolent" is:', optionA: 'Cruel', optionB: 'Kind', optionC: 'Angry', optionD: 'Rich', correctOption: 'B', explanation: 'Benevolent means kind, generous, and well-meaning.' },
    { question: '"She has been working since morning." The tense is:', optionA: 'Present Perfect', optionB: 'Present Perfect Continuous', optionC: 'Past Perfect', optionD: 'Past Continuous', correctOption: 'B', explanation: '"has been working" + "since" indicates an action started in the past and still continuing = Present Perfect Continuous.' },
    { question: 'The antonym of "Ephemeral" is:', optionA: 'Permanent', optionB: 'Short-lived', optionC: 'Fragile', optionD: 'Beautiful', correctOption: 'A', explanation: 'Ephemeral means short-lived. Its antonym is Permanent (lasting forever).' },
    { question: 'Choose the correct sentence:', optionA: 'Each of the boys have come', optionB: 'Each of the boys has come', optionC: 'Each of the boy has come', optionD: 'Each of boys has came', correctOption: 'B', explanation: '"Each" is singular, so it takes a singular verb "has".' },
    { question: 'Which is the plural of "child"?', optionA: 'Childs', optionB: 'Childes', optionC: 'Children', optionD: 'Child\'s', correctOption: 'C', explanation: 'The plural of "child" is "children" (irregular plural).' },
    { question: '"The angry mob set fire ___ the building." Fill in:', optionA: 'at', optionB: 'in', optionC: 'on', optionD: 'to', correctOption: 'D', explanation: 'The correct phrase is "set fire to something."' },
    { question: 'The passive voice of "She writes a letter" is:', optionA: 'A letter is written by her', optionB: 'A letter was written by her', optionC: 'A letter is being written by her', optionD: 'A letter has been written by her', correctOption: 'A', explanation: 'Present simple active → present simple passive: "A letter is written by her."' },
  ]);

  // ===== CURRENT AFFAIRS =====
  await createTest('Current Affairs 2024', 'Latest events and news', categories[8].id, 'medium', 360, 'Monthly Update', [
    { question: 'Which country hosted the G20 Summit in 2023?', optionA: 'Indonesia', optionB: 'India', optionC: 'Brazil', optionD: 'Japan', correctOption: 'B', explanation: 'India hosted the G20 Summit in September 2023 in New Delhi.' },
    { question: 'Chandrayaan-3 successfully landed on the Moon\'s:', optionA: 'North Pole', optionB: 'South Pole', optionC: 'Equator', optionD: 'Far Side', correctOption: 'B', explanation: 'Chandrayaan-3 landed near the Moon\'s south pole on August 23, 2023.' },
    { question: 'Who is the current Chief Minister of Uttar Pradesh (2024)?', optionA: 'Akhilesh Yadav', optionB: 'Yogi Adityanath', optionC: 'Mayawati', optionD: 'Mulayam Singh', correctOption: 'B', explanation: 'Yogi Adityanath is the current Chief Minister of Uttar Pradesh.' },
    { question: 'The new name of Rajpath in New Delhi is:', optionA: 'Sardar Patel Marg', optionB: 'Kartavya Path', optionC: 'Shanti Path', optionD: 'Janpath', correctOption: 'B', explanation: 'Rajpath was renamed to Kartavya Path in September 2022.' },
    { question: 'Which state became India\'s 28th state in 2000?', optionA: 'Jharkhand', optionB: 'Uttarakhand', optionC: 'Chhattisgarh', optionD: 'Telangana', correctOption: 'A', explanation: 'Jharkhand was carved out of Bihar and became India\'s 28th state on November 15, 2000.' },
    { question: 'What is India\'s rank in terms of GDP (PPP) globally?', optionA: '2nd', optionB: '3rd', optionC: '4th', optionD: '5th', correctOption: 'B', explanation: 'India is the 3rd largest economy by GDP (PPP) after China and the USA.' },
    { question: 'The Digital India Programme was launched in:', optionA: '2014', optionB: '2015', optionC: '2016', optionD: '2017', correctOption: 'B', explanation: 'Digital India was launched on July 1, 2015, by Prime Minister Narendra Modi.' },
    { question: 'Which organization did India chair in 2024?', optionA: 'ASEAN', optionB: 'SCO', optionC: 'BRICS', optionD: 'SAARC', correctOption: 'B', explanation: 'India hosted the Shanghai Cooperation Organisation (SCO) summit in 2023-24.' },
    { question: 'The Pradhan Mantri Jan Dhan Yojana was launched in:', optionA: '2013', optionB: '2014', optionC: '2015', optionD: '2016', correctOption: 'B', explanation: 'PMJDY was launched on August 28, 2014, to ensure financial inclusion.' },
    { question: 'What is the theme of India\'s G20 Presidency?', optionA: 'One Earth, One Family', optionB: 'Vasudhaiva Kutumbakam', optionC: 'Unity in Diversity', optionD: 'Atma Nirbhar Bharat', correctOption: 'B', explanation: 'India\'s G20 theme was "Vasudhaiva Kutumbakam" - "One Earth, One Family, One Future".' },
  ]);

  // ===== COMPUTER SCIENCE =====
  await createTest('Computer Fundamentals', 'Basic computer science for competitive exams', categories[9].id, 'easy', 300, 'Practice Set', [
    { question: '1 Gigabyte (GB) equals:', optionA: '1000 MB', optionB: '1024 MB', optionC: '1048 MB', optionD: '512 MB', correctOption: 'B', explanation: '1 GB = 1024 MB (in binary system used by computers).' },
    { question: 'The full form of CPU is:', optionA: 'Central Processing Unit', optionB: 'Computer Personal Unit', optionC: 'Central Program Utility', optionD: 'Core Processing Unit', correctOption: 'A', explanation: 'CPU stands for Central Processing Unit - the brain of the computer.' },
    { question: 'Which is the fastest memory in a computer?', optionA: 'Hard Disk', optionB: 'RAM', optionC: 'Cache Memory', optionD: 'ROM', correctOption: 'C', explanation: 'Cache memory is the fastest memory, located closest to the CPU.' },
    { question: 'HTTP stands for:', optionA: 'HyperText Transfer Protocol', optionB: 'High Tech Transfer Protocol', optionC: 'HyperText Transmission Protocol', optionD: 'Home Tool Transfer Protocol', correctOption: 'A', explanation: 'HTTP stands for HyperText Transfer Protocol, used for web communication.' },
    { question: 'The shortcut to copy text is:', optionA: 'Ctrl + V', optionB: 'Ctrl + C', optionC: 'Ctrl + X', optionD: 'Ctrl + Z', correctOption: 'B', explanation: 'Ctrl + C is the keyboard shortcut for copying text.' },
    { question: 'Which of these is an output device?', optionA: 'Keyboard', optionB: 'Mouse', optionC: 'Scanner', optionD: 'Printer', correctOption: 'D', explanation: 'A printer produces output (printed pages), so it is an output device.' },
    { question: 'What does URL stand for?', optionA: 'Uniform Resource Locator', optionB: 'Universal Reference Link', optionC: 'Unified Resource Language', optionD: 'Uniform Resource Language', correctOption: 'A', explanation: 'URL stands for Uniform Resource Locator - the web address of a resource.' },
    { question: 'An operating system is:', optionA: 'Application software', optionB: 'System software', optionC: 'Utility software', optionD: 'Programming software', correctOption: 'B', explanation: 'An operating system (like Windows, Linux) is system software that manages hardware and software.' },
    { question: 'The binary number 1010 equals decimal:', optionA: '8', optionB: '10', optionC: '12', optionD: '14', correctOption: 'B', explanation: '1010 in binary = 1×8 + 0×4 + 1×2 + 0×1 = 10 in decimal.' },
    { question: 'A firewall is used for:', optionA: 'Data storage', optionB: 'Network security', optionC: 'Word processing', optionD: 'Email sending', correctOption: 'B', explanation: 'A firewall monitors and controls incoming and outgoing network traffic for security.' },
  ]);

  console.log('✅ Seeding completed!');
  console.log(`📊 ${categories.length} categories with government exam-style tests created.`);
}

seed().catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); }).finally(() => db.$disconnect());
