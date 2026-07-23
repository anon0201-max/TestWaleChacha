import { db } from '../src/lib/db';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create Categories
  const categories = await Promise.all([
    db.category.create({
      data: { name: 'General Knowledge', slug: 'general-knowledge', icon: 'Globe', color: '#f59e0b' },
    }),
    db.category.create({
      data: { name: 'Science', slug: 'science', icon: 'Beaker', color: '#10b981' },
    }),
    db.category.create({
      data: { name: 'Mathematics', slug: 'mathematics', icon: 'Calculator', color: '#8b5cf6' },
    }),
    db.category.create({
      data: { name: 'History', slug: 'history', icon: 'Scroll', color: '#f97316' },
    }),
    db.category.create({
      data: { name: 'English', slug: 'english', icon: 'BookOpen', color: '#06b6d4' },
    }),
    db.category.create({
      data: { name: 'Computer Science', slug: 'computer-science', icon: 'Monitor', color: '#ec4899' },
    }),
    db.category.create({
      data: { name: 'Geography', slug: 'geography', icon: 'MapPin', color: '#84cc16' },
    }),
    db.category.create({
      data: { name: 'Current Affairs', slug: 'current-affairs', icon: 'Newspaper', color: '#ef4444' },
    }),
  ]);

  // Helper to create a test with questions
  async function createTest(title: string, description: string, categoryId: string, difficulty: string, timeLimit: number, questions: { question: string; optionA: string; optionB: string; optionC: string; optionD: string; correctOption: string; explanation: string }[]) {
    const test = await db.test.create({
      data: {
        title,
        description,
        categoryId,
        difficulty,
        timeLimit,
        totalQuestions: questions.length,
        questions: {
          create: questions.map((q, i) => ({ ...q, order: i })),
        },
      },
      include: { questions: true },
    });
    return test;
  }

  // ===== GENERAL KNOWLEDGE TESTS =====
  await createTest('Basic General Knowledge', 'Test your everyday general knowledge', categories[0].id, 'easy', 300, [
    { question: 'What is the capital of India?', optionA: 'Mumbai', optionB: 'New Delhi', optionC: 'Kolkata', optionD: 'Chennai', correctOption: 'B', explanation: 'New Delhi is the capital of India.' },
    { question: 'Which planet is known as the Red Planet?', optionA: 'Venus', optionB: 'Jupiter', optionC: 'Mars', optionD: 'Saturn', correctOption: 'C', explanation: 'Mars is called the Red Planet due to its reddish appearance.' },
    { question: 'What is the largest ocean on Earth?', optionA: 'Atlantic', optionB: 'Indian', optionC: 'Arctic', optionD: 'Pacific', correctOption: 'D', explanation: 'The Pacific Ocean is the largest and deepest ocean.' },
    { question: 'How many continents are there?', optionA: '5', optionB: '6', optionC: '7', optionD: '8', correctOption: 'C', explanation: 'There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.' },
    { question: 'What gas do plants absorb from the atmosphere?', optionA: 'Oxygen', optionB: 'Nitrogen', optionC: 'Carbon Dioxide', optionD: 'Hydrogen', correctOption: 'C', explanation: 'Plants absorb CO2 during photosynthesis.' },
    { question: 'Who wrote the Indian national anthem?', optionA: 'Bankim Chandra', optionB: 'Rabindranath Tagore', optionC: 'Sarojini Naidu', optionD: 'Mahatma Gandhi', correctOption: 'B', explanation: 'Jana Gana Mana was written by Rabindranath Tagore.' },
    { question: 'What is the hardest natural substance?', optionA: 'Gold', optionB: 'Iron', optionC: 'Diamond', optionD: 'Platinum', correctOption: 'C', explanation: 'Diamond is the hardest known natural material.' },
    { question: 'Which animal is known as the King of the Jungle?', optionA: 'Tiger', optionB: 'Elephant', optionC: 'Lion', optionD: 'Bear', correctOption: 'C', explanation: 'The lion is traditionally called the King of the Jungle.' },
    { question: 'What is the boiling point of water?', optionA: '90°C', optionB: '100°C', optionC: '110°C', optionD: '120°C', correctOption: 'B', explanation: 'Water boils at 100°C (212°F) at standard atmospheric pressure.' },
    { question: 'How many days are in a leap year?', optionA: '364', optionB: '365', optionC: '366', optionD: '367', correctOption: 'C', explanation: 'A leap year has 366 days with February having 29 days.' },
  ]);

  await createTest('Advanced General Knowledge', 'Challenge yourself with advanced GK questions', categories[0].id, 'hard', 600, [
    { question: 'What is the smallest country in the world?', optionA: 'Monaco', optionB: 'Vatican City', optionC: 'San Marino', optionD: 'Liechtenstein', correctOption: 'B', explanation: 'Vatican City is the smallest country by area and population.' },
    { question: 'Which element has the chemical symbol "Au"?', optionA: 'Silver', optionB: 'Aluminum', optionC: 'Gold', optionD: 'Argon', correctOption: 'C', explanation: 'Au comes from the Latin word "aurum" meaning gold.' },
    { question: 'What is the longest river in the world?', optionA: 'Amazon', optionB: 'Mississippi', optionC: 'Yangtze', optionD: 'Nile', correctOption: 'D', explanation: 'The Nile River is approximately 6,650 km long.' },
    { question: 'Who discovered penicillin?', optionA: 'Louis Pasteur', optionB: 'Alexander Fleming', optionC: 'Marie Curie', optionD: 'Joseph Lister', correctOption: 'B', explanation: 'Alexander Fleming discovered penicillin in 1928.' },
    { question: 'What is the speed of light?', optionA: '300,000 km/s', optionB: '150,000 km/s', optionC: '500,000 km/s', optionD: '200,000 km/s', correctOption: 'A', explanation: 'The speed of light is approximately 300,000 km/s.' },
    { question: 'Which is the largest desert in the world?', optionA: 'Sahara', optionB: 'Arabian', optionC: 'Gobi', optionD: 'Antarctic', correctOption: 'D', explanation: 'Antarctica is technically the largest desert in the world.' },
    { question: 'What is the national flower of India?', optionA: 'Rose', optionB: 'Sunflower', optionC: 'Lotus', optionD: 'Jasmine', correctOption: 'C', explanation: 'Lotus is the national flower of India.' },
    { question: 'Which country hosted the 2020 Olympics?', optionA: 'China', optionB: 'Japan', optionC: 'Brazil', optionD: 'USA', correctOption: 'B', explanation: 'The 2020 Olympics were held in Tokyo, Japan (in 2021 due to COVID).' },
    { question: 'What is the currency of Japan?', optionA: 'Won', optionB: 'Yuan', optionC: 'Yen', optionD: 'Baht', correctOption: 'C', explanation: 'The Japanese Yen is the official currency of Japan.' },
    { question: 'How many bones does an adult human have?', optionA: '196', optionB: '206', optionC: '216', optionD: '226', correctOption: 'B', explanation: 'An adult human skeleton consists of 206 bones.' },
  ]);

  await createTest('India Special GK', 'All about India - culture, facts and more', categories[0].id, 'medium', 480, [
    { question: 'Which is the national bird of India?', optionA: 'Sparrow', optionB: 'Parrot', optionC: 'Peacock', optionD: 'Eagle', correctOption: 'C', explanation: 'The Indian Peacock is the national bird of India.' },
    { question: 'In which year did India gain independence?', optionA: '1945', optionB: '1947', optionC: '1950', optionD: '1942', correctOption: 'B', explanation: 'India gained independence on 15th August 1947.' },
    { question: 'Which is the longest river in India?', optionA: 'Yamuna', optionB: 'Godavari', optionC: 'Ganga', optionD: 'Brahmaputra', correctOption: 'C', explanation: 'The Ganga is the longest river in India at 2,525 km.' },
    { question: 'Who was the first Prime Minister of India?', optionA: 'Sardar Patel', optionB: 'Jawaharlal Nehru', optionC: 'Rajendra Prasad', optionD: 'Mahatma Gandhi', correctOption: 'B', explanation: 'Jawaharlal Nehru was the first Prime Minister of India.' },
    { question: 'Which state is known as "God\'s Own Country"?', optionA: 'Tamil Nadu', optionB: 'Kerala', optionC: 'Karnataka', optionD: 'Goa', correctOption: 'B', explanation: 'Kerala is famously known as "God\'s Own Country".' },
    { question: 'What is the highest mountain peak in India?', optionA: 'Nanda Devi', optionB: 'K2', optionC: 'Kangchenjunga', optionD: 'Mount Everest', correctOption: 'C', explanation: 'Kangchenjunga (8,586m) is the highest peak in India.' },
    { question: 'Which Indian city is called the "City of Joy"?', optionA: 'Mumbai', optionB: 'Delhi', optionC: 'Kolkata', optionD: 'Chennai', correctOption: 'C', explanation: 'Kolkata is known as the "City of Joy".' },
    { question: 'What is the national animal of India?', optionA: 'Lion', optionB: 'Tiger', optionC: 'Elephant', optionD: 'Leopard', correctOption: 'B', explanation: 'The Bengal Tiger is the national animal of India.' },
    { question: 'Which festival is known as the Festival of Lights?', optionA: 'Holi', optionB: 'Diwali', optionC: 'Eid', optionD: 'Christmas', correctOption: 'B', explanation: 'Diwali, the Festival of Lights, is one of India\'s biggest festivals.' },
    { question: 'How many states does India have?', optionA: '28', optionB: '29', optionC: '30', optionD: '31', correctOption: 'A', explanation: 'India has 28 states and 8 Union Territories.' },
  ]);

  // ===== SCIENCE TESTS =====
  await createTest('Physics Fundamentals', 'Test your knowledge of basic physics', categories[1].id, 'medium', 480, [
    { question: 'What is Newton\'s first law of motion about?', optionA: 'Acceleration', optionB: 'Inertia', optionC: 'Gravity', optionD: 'Friction', correctOption: 'B', explanation: 'Newton\'s first law states that an object at rest stays at rest unless acted upon by a force (inertia).' },
    { question: 'What is the SI unit of force?', optionA: 'Joule', optionB: 'Watt', optionC: 'Newton', optionD: 'Pascal', correctOption: 'C', explanation: 'The Newton (N) is the SI unit of force.' },
    { question: 'What is the acceleration due to gravity on Earth?', optionA: '8.9 m/s²', optionB: '9.8 m/s²', optionC: '10.8 m/s²', optionD: '7.8 m/s²', correctOption: 'B', explanation: 'Standard gravity on Earth is approximately 9.8 m/s².' },
    { question: 'Which type of energy is possessed by a moving object?', optionA: 'Potential', optionB: 'Kinetic', optionC: 'Thermal', optionD: 'Chemical', correctOption: 'B', explanation: 'Kinetic energy is the energy possessed by a moving object.' },
    { question: 'What is the formula for calculating speed?', optionA: 'Speed = Force × Distance', optionB: 'Speed = Distance / Time', optionC: 'Speed = Time / Distance', optionD: 'Speed = Mass × Velocity', correctOption: 'B', explanation: 'Speed is calculated as Distance divided by Time.' },
    { question: 'Sound cannot travel through:', optionA: 'Air', optionB: 'Water', optionC: 'Steel', optionD: 'Vacuum', correctOption: 'D', explanation: 'Sound requires a medium to travel and cannot propagate through vacuum.' },
    { question: 'What is the unit of electrical resistance?', optionA: 'Ampere', optionB: 'Volt', optionC: 'Ohm', optionD: 'Watt', correctOption: 'C', explanation: 'The Ohm (Ω) is the SI unit of electrical resistance.' },
    { question: 'Light travels fastest in:', optionA: 'Water', optionB: 'Glass', optionC: 'Air', optionD: 'Vacuum', correctOption: 'D', explanation: 'Light travels fastest in vacuum at approximately 3×10⁸ m/s.' },
    { question: 'What is the process of splitting an atom called?', optionA: 'Fusion', optionB: 'Fission', optionC: 'Ionization', optionD: 'Oxidation', correctOption: 'B', explanation: 'Nuclear fission is the process of splitting an atomic nucleus.' },
    { question: 'Which mirror is used in car headlights?', optionA: 'Concave', optionB: 'Convex', optionC: 'Plane', optionD: 'Cylindrical', correctOption: 'A', explanation: 'Concave mirrors are used in car headlights to produce a parallel beam of light.' },
  ]);

  await createTest('Biology Basics', 'Explore the world of living organisms', categories[1].id, 'easy', 360, [
    { question: 'What is the powerhouse of the cell?', optionA: 'Nucleus', optionB: 'Ribosome', optionC: 'Mitochondria', optionD: 'Golgi Body', correctOption: 'C', explanation: 'Mitochondria are known as the powerhouse of the cell as they produce energy (ATP).' },
    { question: 'What process do plants use to make food?', optionA: 'Respiration', optionB: 'Photosynthesis', optionC: 'Transpiration', optionD: 'Digestion', correctOption: 'B', explanation: 'Plants use photosynthesis to convert sunlight, water, and CO2 into food.' },
    { question: 'DNA stands for:', optionA: 'Deoxyribonucleic Acid', optionB: 'Dinitrogen Acid', optionC: 'Deoxy Nitrogen Acid', optionD: 'Dynamic Nuclear Acid', correctOption: 'A', explanation: 'DNA stands for Deoxyribonucleic Acid.' },
    { question: 'Which blood group is the universal donor?', optionA: 'A+', optionB: 'B+', optionC: 'AB+', optionD: 'O-', correctOption: 'D', explanation: 'O- blood type is the universal donor as it can be given to any blood type.' },
    { question: 'How many chambers does the human heart have?', optionA: '2', optionB: '3', optionC: '4', optionD: '5', correctOption: 'C', explanation: 'The human heart has 4 chambers: 2 atria and 2 ventricles.' },
    { question: 'What is the largest organ in the human body?', optionA: 'Liver', optionB: 'Heart', optionC: 'Brain', optionD: 'Skin', correctOption: 'D', explanation: 'The skin is the largest organ of the human body.' },
    { question: 'Which vitamin is produced when skin is exposed to sunlight?', optionA: 'Vitamin A', optionB: 'Vitamin B', optionC: 'Vitamin C', optionD: 'Vitamin D', correctOption: 'D', explanation: 'Vitamin D is synthesized when skin is exposed to UV-B rays from sunlight.' },
    { question: 'What is the basic unit of life?', optionA: 'Atom', optionB: 'Cell', optionC: 'Molecule', optionD: 'Organ', correctOption: 'B', explanation: 'The cell is the basic structural and functional unit of all living organisms.' },
    { question: 'Which gas is essential for respiration?', optionA: 'Carbon Dioxide', optionB: 'Nitrogen', optionC: 'Oxygen', optionD: 'Hydrogen', correctOption: 'C', explanation: 'Oxygen is essential for cellular respiration in humans.' },
    { question: 'What type of organism is an amoeba?', optionA: 'Multi-cellular', optionB: 'Uni-cellular', optionC: 'Prokaryotic', optionD: 'Viral', correctOption: 'B', explanation: 'Amoeba is a single-celled (unicellular) organism.' },
  ]);

  await createTest('Chemistry Essentials', 'Master the fundamentals of chemistry', categories[1].id, 'medium', 480, [
    { question: 'What is the pH value of pure water?', optionA: '5', optionB: '7', optionC: '9', optionD: '6', correctOption: 'B', explanation: 'Pure water has a neutral pH of 7.' },
    { question: 'Which element has the atomic number 1?', optionA: 'Helium', optionB: 'Hydrogen', optionC: 'Lithium', optionD: 'Carbon', correctOption: 'B', explanation: 'Hydrogen has atomic number 1 and is the lightest element.' },
    { question: 'What is the chemical formula for water?', optionA: 'CO2', optionB: 'NaCl', optionC: 'H2O', optionD: 'O2', correctOption: 'C', explanation: 'Water is H2O - two hydrogen atoms and one oxygen atom.' },
    { question: 'Which gas is known as laughing gas?', optionA: 'Nitrogen', optionB: 'Nitrous Oxide', optionC: 'Carbon Monoxide', optionD: 'Oxygen', correctOption: 'B', explanation: 'Nitrous Oxide (N2O) is commonly called laughing gas.' },
    { question: 'What type of bond involves sharing of electrons?', optionA: 'Ionic', optionB: 'Covalent', optionC: 'Metallic', optionD: 'Hydrogen', correctOption: 'B', explanation: 'Covalent bonds involve the sharing of electron pairs between atoms.' },
    { question: 'What is the most abundant gas in Earth\'s atmosphere?', optionA: 'Oxygen', optionB: 'Carbon Dioxide', optionC: 'Nitrogen', optionD: 'Argon', correctOption: 'C', explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.' },
    { question: 'What is the chemical symbol for Iron?', optionA: 'Ir', optionB: 'In', optionC: 'Fe', optionD: 'Io', correctOption: 'C', explanation: 'Fe comes from the Latin word "ferrum" meaning iron.' },
    { question: 'Which acid is present in lemon juice?', optionA: 'Sulfuric Acid', optionB: 'Citric Acid', optionC: 'Acetic Acid', optionD: 'Hydrochloric Acid', correctOption: 'B', explanation: 'Lemon juice contains citric acid which gives it a sour taste.' },
    { question: 'What is an atom\'s nucleus made of?', optionA: 'Electrons & Neutrons', optionB: 'Protons & Electrons', optionC: 'Protons & Neutrons', optionD: 'Only Protons', correctOption: 'C', explanation: 'The nucleus contains protons and neutrons.' },
    { question: 'What happens during oxidation?', optionA: 'Gain of electrons', optionB: 'Loss of electrons', optionC: 'Gain of neutrons', optionD: 'Loss of protons', correctOption: 'B', explanation: 'Oxidation involves the loss of electrons from a substance.' },
  ]);

  // ===== MATHEMATICS TESTS =====
  await createTest('Algebra Challenge', 'Test your algebra skills', categories[2].id, 'medium', 600, [
    { question: 'If x + 5 = 12, what is x?', optionA: '5', optionB: '6', optionC: '7', optionD: '8', correctOption: 'C', explanation: 'x + 5 = 12, so x = 12 - 5 = 7.' },
    { question: 'What is the value of 2² + 3²?', optionA: '13', optionB: '25', optionC: '10', optionD: '12', correctOption: 'A', explanation: '2² + 3² = 4 + 9 = 13.' },
    { question: 'What is the square root of 144?', optionA: '10', optionB: '11', optionC: '12', optionD: '14', correctOption: 'C', explanation: '√144 = 12 because 12 × 12 = 144.' },
    { question: 'Simplify: 3x + 2x', optionA: '6x', optionB: '5x', optionC: 'x', optionD: '5x²', correctOption: 'B', explanation: '3x + 2x = 5x (combining like terms).' },
    { question: 'What is 15% of 200?', optionA: '25', optionB: '30', optionC: '35', optionD: '40', correctOption: 'B', explanation: '15% of 200 = (15/100) × 200 = 30.' },
    { question: 'If a triangle has angles 60° and 80°, what is the third angle?', optionA: '30°', optionB: '40°', optionC: '50°', optionD: '60°', correctOption: 'B', explanation: 'Sum of angles in a triangle = 180°, so third angle = 180 - 60 - 80 = 40°.' },
    { question: 'What is the LCM of 4 and 6?', optionA: '10', optionB: '12', optionC: '24', optionD: '8', correctOption: 'B', explanation: 'LCM of 4 and 6 is 12.' },
    { question: 'What is the value of (a+b)² when a=3, b=4?', optionA: '25', optionB: '49', optionC: '36', optionD: '12', correctOption: 'B', explanation: '(3+4)² = 7² = 49.' },
    { question: 'How many prime numbers are there between 1 and 10?', optionA: '3', optionB: '4', optionC: '5', optionD: '6', correctOption: 'B', explanation: 'The primes are: 2, 3, 5, 7 — total 4 primes.' },
    { question: 'What is the area of a circle with radius 7? (Use π = 22/7)', optionA: '144', optionB: '154', optionC: '176', optionD: '196', correctOption: 'B', explanation: 'Area = πr² = (22/7) × 49 = 154.' },
  ]);

  await createTest('Speed Math', 'Quick calculations under time pressure', categories[2].id, 'easy', 180, [
    { question: 'What is 17 × 3?', optionA: '48', optionB: '51', optionC: '54', optionD: '57', correctOption: 'B', explanation: '17 × 3 = 51.' },
    { question: 'What is 256 ÷ 16?', optionA: '14', optionB: '15', optionC: '16', optionD: '18', correctOption: 'C', explanation: '256 ÷ 16 = 16.' },
    { question: 'What is 45 + 67?', optionA: '102', optionB: '112', optionC: '122', optionD: '108', correctOption: 'B', explanation: '45 + 67 = 112.' },
    { question: 'What is 1000 - 347?', optionA: '643', optionB: '653', optionC: '663', optionD: '673', correctOption: 'B', explanation: '1000 - 347 = 653.' },
    { question: 'What is 25 × 4?', optionA: '50', optionB: '75', optionC: '100', optionD: '125', correctOption: 'C', explanation: '25 × 4 = 100.' },
    { question: 'What is 144 ÷ 12?', optionA: '10', optionB: '11', optionC: '12', optionD: '13', correctOption: 'C', explanation: '144 ÷ 12 = 12.' },
    { question: 'What is 8³?', optionA: '512', optionB: '524', optionC: '216', optionD: '729', correctOption: 'A', explanation: '8³ = 8 × 8 × 8 = 512.' },
    { question: 'What is 99 + 99?', optionA: '188', optionB: '198', optionC: '208', optionD: '199', correctOption: 'B', explanation: '99 + 99 = 198.' },
    { question: 'What is half of 250?', optionA: '115', optionB: '120', optionC: '125', optionD: '130', correctOption: 'C', explanation: '250 ÷ 2 = 125.' },
    { question: 'What is 12 × 12?', optionA: '134', optionB: '144', optionC: '154', optionD: '124', correctOption: 'B', explanation: '12 × 12 = 144.' },
  ]);

  // ===== HISTORY TESTS =====
  await createTest('Indian History', 'Journey through India\'s rich past', categories[3].id, 'medium', 480, [
    { question: 'Who was the founder of the Maurya Empire?', optionA: 'Ashoka', optionB: 'Chandragupta Maurya', optionC: 'Bindusara', optionD: 'Harsha', correctOption: 'B', explanation: 'Chandragupta Maurya founded the Maurya Empire in 322 BCE.' },
    { question: 'The Battle of Plassey was fought in which year?', optionA: '1757', optionB: '1857', optionC: '1764', optionD: '1947', correctOption: 'A', explanation: 'The Battle of Plassey was fought in 1757 between British and Siraj-ud-Daulah.' },
    { question: 'Who built the Taj Mahal?', optionA: 'Akbar', optionB: 'Jahangir', optionC: 'Shah Jahan', optionD: 'Aurangzeb', correctOption: 'C', explanation: 'Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal.' },
    { question: 'The Indus Valley Civilization was discovered in which year?', optionA: '1921', optionB: '1931', optionC: '1941', optionD: '1951', correctOption: 'A', explanation: 'The Indus Valley Civilization was discovered in 1921.' },
    { question: 'Who started the Quit India Movement?', optionA: 'Jawaharlal Nehru', optionB: 'Subhash Chandra Bose', optionC: 'Mahatma Gandhi', optionD: 'Sardar Patel', correctOption: 'C', explanation: 'Mahatma Gandhi launched the Quit India Movement in 1942.' },
    { question: 'The Mughal Empire was founded by:', optionA: 'Akbar', optionB: 'Humayun', optionC: 'Babur', optionD: 'Shah Jahan', correctOption: 'C', explanation: 'Babur founded the Mughal Empire in 1526.' },
    { question: 'Who was the first Indian woman to win a Nobel Prize?', optionA: 'Indira Gandhi', optionB: 'Mother Teresa', optionC: 'Sarojini Naidu', optionD: 'Kiran Bedi', correctOption: 'B', explanation: 'Mother Teresa won the Nobel Peace Prize in 1979.' },
    { question: 'The Indian Constitution came into effect on:', optionA: '15 Aug 1947', optionB: '26 Jan 1950', optionC: '26 Nov 1949', optionD: '2 Oct 1950', correctOption: 'B', explanation: 'The Indian Constitution came into effect on 26 January 1950.' },
    { question: 'Who was known as "Netaji"?', optionA: 'Mahatma Gandhi', optionB: 'Jawaharlal Nehru', optionC: 'Subhash Chandra Bose', optionD: 'Bhagat Singh', correctOption: 'C', explanation: 'Subhash Chandra Bose was affectionately called Netaji.' },
    { question: 'The Jallianwala Bagh massacre occurred in which city?', optionA: 'Delhi', optionB: 'Mumbai', optionC: 'Kolkata', optionD: 'Amritsar', correctOption: 'D', explanation: 'The Jallianwala Bagh massacre took place in Amritsar on 13 April 1919.' },
  ]);

  await createTest('World History', 'Major events that shaped the world', categories[3].id, 'hard', 600, [
    { question: 'World War I began in which year?', optionA: '1912', optionB: '1914', optionC: '1916', optionD: '1918', correctOption: 'B', explanation: 'World War I began in 1914 after the assassination of Archduke Franz Ferdinand.' },
    { question: 'The French Revolution started in:', optionA: '1776', optionB: '1789', optionC: '1799', optionD: '1804', correctOption: 'B', explanation: 'The French Revolution began in 1789 with the storming of the Bastille.' },
    { question: 'Who was the first person to walk on the Moon?', optionA: 'Buzz Aldrin', optionB: 'Neil Armstrong', optionC: 'Yuri Gagarin', optionD: 'John Glenn', correctOption: 'B', explanation: 'Neil Armstrong became the first person to walk on the Moon on July 20, 1969.' },
    { question: 'The Berlin Wall fell in which year?', optionA: '1987', optionB: '1988', optionC: '1989', optionD: '1990', correctOption: 'C', explanation: 'The Berlin Wall fell on November 9, 1989.' },
    { question: 'The Renaissance began in which country?', optionA: 'France', optionB: 'England', optionC: 'Italy', optionD: 'Spain', correctOption: 'C', explanation: 'The Renaissance began in Italy in the 14th century.' },
    { question: 'Who was the first President of the United States?', optionA: 'Thomas Jefferson', optionB: 'George Washington', optionC: 'Abraham Lincoln', optionD: 'John Adams', correctOption: 'B', explanation: 'George Washington was the first US President, serving from 1789 to 1797.' },
    { question: 'The Industrial Revolution began in:', optionA: 'France', optionB: 'Germany', optionC: 'United States', optionD: 'England', correctOption: 'D', explanation: 'The Industrial Revolution began in England in the late 18th century.' },
    { question: 'World War II ended in which year?', optionA: '1943', optionB: '1944', optionC: '1945', optionD: '1946', correctOption: 'C', explanation: 'World War II ended in 1945 with the surrender of Japan.' },
    { question: 'Who invented the printing press?', optionA: 'Thomas Edison', optionB: 'Johannes Gutenberg', optionC: 'Leonardo da Vinci', optionD: 'Galileo Galilei', correctOption: 'B', explanation: 'Johannes Gutenberg invented the printing press around 1440.' },
    { question: 'The United Nations was founded in:', optionA: '1943', optionB: '1944', optionC: '1945', optionD: '1946', correctOption: 'C', explanation: 'The UN was founded on October 24, 1945.' },
  ]);

  // ===== ENGLISH TESTS =====
  await createTest('English Grammar', 'Test your grammar knowledge', categories[4].id, 'medium', 360, [
    { question: 'Which is the correct sentence?', optionA: 'She don\'t like coffee', optionB: 'She doesn\'t likes coffee', optionC: 'She doesn\'t like coffee', optionD: 'She not like coffee', correctOption: 'C', explanation: '"She doesn\'t like coffee" uses the correct negative form with "doesn\'t" + base verb.' },
    { question: 'What is the past tense of "run"?', optionA: 'Runned', optionB: 'Ran', optionC: 'Running', optionD: 'Runs', correctOption: 'B', explanation: 'The past tense of "run" is "ran" (irregular verb).' },
    { question: 'Choose the correct preposition: "She is fond ___ reading"', optionA: 'in', optionB: 'of', optionC: 'at', optionD: 'for', correctOption: 'B', explanation: '"Fond of" is the correct prepositional phrase.' },
    { question: 'Which is a proper noun?', optionA: 'city', optionB: 'river', optionC: 'London', optionD: 'mountain', correctOption: 'C', explanation: 'London is a proper noun as it names a specific place.' },
    { question: 'What is the plural of "child"?', optionA: 'Childs', optionB: 'Childes', optionC: 'Children', optionD: 'Child\'s', correctOption: 'C', explanation: 'The plural of "child" is "children" (irregular plural).' },
    { question: 'Identify the adjective: "The ___ girl sang beautifully"', optionA: 'sing', optionB: 'beautiful', optionC: 'beautifully', optionD: 'girl', correctOption: 'B', explanation: '"Beautiful" is an adjective describing the noun "girl".' },
    { question: 'What is the synonym of "happy"?', optionA: 'Sad', optionB: 'Angry', optionC: 'Joyful', optionD: 'Tired', correctOption: 'C', explanation: '"Joyful" is a synonym of "happy".' },
    { question: 'Which sentence is in passive voice?', optionA: 'The cat chased the mouse', optionB: 'The mouse was chased by the cat', optionC: 'The cat is chasing the mouse', optionD: 'The cat chases the mouse', correctOption: 'B', explanation: '"The mouse was chased by the cat" is in passive voice.' },
    { question: 'What is an antonym of "brave"?', optionA: 'Strong', optionB: 'Cowardly', optionC: 'Smart', optionD: 'Kind', correctOption: 'B', explanation: '"Cowardly" is the opposite of "brave".' },
    { question: '"I have been working" is in which tense?', optionA: 'Present Perfect', optionB: 'Present Perfect Continuous', optionC: 'Past Perfect', optionD: 'Future Perfect', correctOption: 'B', explanation: '"I have been working" uses the Present Perfect Continuous tense.' },
  ]);

  await createTest('English Vocabulary', 'Expand your word power', categories[4].id, 'easy', 300, [
    { question: 'What does "benevolent" mean?', optionA: 'Evil', optionB: 'Kind and generous', optionC: 'Angry', optionD: 'Confused', correctOption: 'B', explanation: 'Benevolent means well-meaning, kind, and generous.' },
    { question: 'What is the meaning of "ubiquitous"?', optionA: 'Rare', optionB: 'Expensive', optionC: 'Present everywhere', optionD: 'Beautiful', correctOption: 'C', explanation: 'Ubiquitous means present, appearing, or found everywhere.' },
    { question: '"Ephemeral" means:', optionA: 'Permanent', optionB: 'Short-lived', optionC: 'Ancient', optionD: 'Colorful', correctOption: 'B', explanation: 'Ephemeral means lasting for a very short time.' },
    { question: 'What does "eloquent" mean?', optionA: 'Silent', optionB: 'Confused', optionC: 'Fluent and persuasive', optionD: 'Slow', correctOption: 'C', explanation: 'Eloquent means fluent or persuasive in speaking or writing.' },
    { question: '"Candid" means:', optionA: 'Dishonest', optionB: 'Truthful and honest', optionC: 'Shy', optionD: 'Funny', correctOption: 'B', explanation: 'Candid means truthful, straightforward, and frank.' },
    { question: 'What does "pragmatic" mean?', optionA: 'Idealistic', optionB: 'Practical', optionC: 'Lazy', optionD: 'Creative', correctOption: 'B', explanation: 'Pragmatic means dealing with things sensibly and realistically.' },
    { question: '"Ambiguous" means:', optionA: 'Very clear', optionB: 'Open to more than one interpretation', optionC: 'Very old', optionD: 'Very new', correctOption: 'B', explanation: 'Ambiguous means having more than one possible meaning.' },
    { question: 'What is the meaning of "resilient"?', optionA: 'Weak', optionB: 'Able to recover quickly', optionC: 'Rigid', optionD: 'Heavy', correctOption: 'B', explanation: 'Resilient means able to withstand or recover quickly from difficulties.' },
    { question: '"Diligent" means:', optionA: 'Careless', optionB: 'Hardworking', optionC: 'Lazy', optionD: 'Clever', correctOption: 'B', explanation: 'Diligent means having or showing care and conscientiousness in one\'s work.' },
    { question: 'What does "inevitable" mean?', optionA: 'Avoidable', optionB: 'Certain to happen', optionC: 'Impossible', optionD: 'Optional', correctOption: 'B', explanation: 'Inevitable means certain to happen; unavoidable.' },
  ]);

  // ===== COMPUTER SCIENCE TESTS =====
  await createTest('Computer Basics', 'Fundamental computer science concepts', categories[5].id, 'easy', 300, [
    { question: 'What does CPU stand for?', optionA: 'Central Processing Unit', optionB: 'Computer Personal Unit', optionC: 'Central Program Utility', optionD: 'Core Processing Unit', correctOption: 'A', explanation: 'CPU stands for Central Processing Unit - the brain of the computer.' },
    { question: 'What is RAM?', optionA: 'Read Access Memory', optionB: 'Random Access Memory', optionC: 'Rapid Access Module', optionD: 'Read And Modify', correctOption: 'B', explanation: 'RAM stands for Random Access Memory - volatile memory used for temporary data storage.' },
    { question: 'Which is an operating system?', optionA: 'Chrome', optionB: 'Windows', optionC: 'Photoshop', optionD: 'Word', correctOption: 'B', explanation: 'Windows is an operating system by Microsoft.' },
    { question: 'What does HTML stand for?', optionA: 'Hyper Text Markup Language', optionB: 'High Tech Modern Language', optionC: 'Hyper Transfer Markup Language', optionD: 'Home Tool Markup Language', correctOption: 'A', explanation: 'HTML stands for Hyper Text Markup Language.' },
    { question: '1 KB equals:', optionA: '100 bytes', optionB: '512 bytes', optionC: '1024 bytes', optionD: '2048 bytes', correctOption: 'C', explanation: '1 KB (Kilobyte) = 1024 bytes.' },
    { question: 'What is a firewall in computing?', optionA: 'Physical wall', optionB: 'Network security system', optionC: 'A type of virus', optionD: 'A hardware component', correctOption: 'B', explanation: 'A firewall is a network security system that monitors and controls incoming and outgoing traffic.' },
    { question: 'Which language is primarily used for web pages styling?', optionA: 'JavaScript', optionB: 'Python', optionC: 'CSS', optionD: 'Java', correctOption: 'C', explanation: 'CSS (Cascading Style Sheets) is used for styling web pages.' },
    { question: 'What does URL stand for?', optionA: 'Uniform Resource Locator', optionB: 'Universal Reference Link', optionC: 'Unified Resource Language', optionD: 'Universal Resource Locator', correctOption: 'A', explanation: 'URL stands for Uniform Resource Locator.' },
    { question: 'What is a bug in software?', optionA: 'A feature', optionB: 'An error or defect', optionC: 'A virus', optionD: 'A plugin', correctOption: 'B', explanation: 'A bug is an error, flaw, or defect in a software program.' },
    { question: 'Which device is used for input?', optionA: 'Monitor', optionB: 'Printer', optionC: 'Keyboard', optionD: 'Speaker', correctOption: 'C', explanation: 'A keyboard is an input device used to enter data into the computer.' },
  ]);

  await createTest('Programming Concepts', 'Test your programming knowledge', categories[5].id, 'hard', 600, [
    { question: 'What is a loop in programming?', optionA: 'A type of variable', optionB: 'Repeated execution of code', optionC: 'A function', optionD: 'A class', correctOption: 'B', explanation: 'A loop repeatedly executes a block of code until a condition is met.' },
    { question: 'Which data structure uses FIFO?', optionA: 'Stack', optionB: 'Array', optionC: 'Queue', optionD: 'Tree', correctOption: 'C', explanation: 'Queue follows FIFO (First In, First Out) principle.' },
    { question: 'What is OOP?', optionA: 'Open Output Processing', optionB: 'Object-Oriented Programming', optionC: 'Online Operating Protocol', optionD: 'Optimal Output Processing', correctOption: 'B', explanation: 'OOP stands for Object-Oriented Programming.' },
    { question: 'Which sorting algorithm has the best average time complexity?', optionA: 'Bubble Sort', optionB: 'Merge Sort', optionC: 'Selection Sort', optionD: 'Insertion Sort', correctOption: 'B', explanation: 'Merge Sort has O(n log n) average time complexity, which is better than O(n²) of the others.' },
    { question: 'What is recursion?', optionA: 'A type of loop', optionB: 'A function calling itself', optionC: 'A variable type', optionD: 'An error handling', correctOption: 'B', explanation: 'Recursion is when a function calls itself to solve a smaller instance of the same problem.' },
    { question: 'What does API stand for?', optionA: 'Application Programming Interface', optionB: 'Applied Program Integration', optionC: 'Application Process Integration', optionD: 'Automated Programming Interface', correctOption: 'A', explanation: 'API stands for Application Programming Interface.' },
    { question: 'Which symbol is used for comments in Python?', optionA: '//', optionB: '#', optionC: '/*', optionD: '--', correctOption: 'B', explanation: '# is used for single-line comments in Python.' },
    { question: 'What is a database index?', optionA: 'A list of databases', optionB: 'A data structure for faster search', optionC: 'A backup of data', optionD: 'A type of query', correctOption: 'B', explanation: 'A database index is a data structure that improves the speed of data retrieval.' },
    { question: 'What is the time complexity of binary search?', optionA: 'O(n)', optionB: 'O(n²)', optionC: 'O(log n)', optionD: 'O(1)', correctOption: 'C', explanation: 'Binary search has O(log n) time complexity.' },
    { question: 'What does SQL stand for?', optionA: 'Structured Query Language', optionB: 'Simple Query Language', optionC: 'Sequential Query Logic', optionD: 'Standard Query Language', correctOption: 'A', explanation: 'SQL stands for Structured Query Language.' },
  ]);

  // ===== GEOGRAPHY TESTS =====
  await createTest('World Geography', 'Explore our planet\'s geography', categories[6].id, 'medium', 480, [
    { question: 'What is the largest continent?', optionA: 'Africa', optionB: 'North America', optionC: 'Asia', optionD: 'Europe', correctOption: 'C', explanation: 'Asia is the largest continent by both area and population.' },
    { question: 'Which is the largest island in the world?', optionA: 'Madagascar', optionB: 'Borneo', optionC: 'Greenland', optionD: 'New Guinea', correctOption: 'C', explanation: 'Greenland is the largest island in the world.' },
    { question: 'The Sahara Desert is located in:', optionA: 'Asia', optionB: 'Africa', optionC: 'Australia', optionD: 'South America', correctOption: 'B', explanation: 'The Sahara Desert is in Northern Africa.' },
    { question: 'Which river flows through Paris?', optionA: 'Rhine', optionB: 'Danube', optionC: 'Seine', optionD: 'Thames', correctOption: 'C', explanation: 'The Seine River flows through Paris, France.' },
    { question: 'What is the highest waterfall in the world?', optionA: 'Victoria Falls', optionB: 'Niagara Falls', optionC: 'Angel Falls', optionD: 'Iguazu Falls', correctOption: 'C', explanation: 'Angel Falls in Venezuela is the highest waterfall at 979 meters.' },
    { question: 'Which country has the most natural lakes?', optionA: 'USA', optionB: 'Russia', optionC: 'Canada', optionD: 'Finland', correctOption: 'C', explanation: 'Canada has the most natural lakes in the world.' },
    { question: 'The Great Barrier Reef is located in:', optionA: 'Brazil', optionB: 'Australia', optionC: 'Indonesia', optionD: 'Philippines', correctOption: 'B', explanation: 'The Great Barrier Reef is off the coast of Queensland, Australia.' },
    { question: 'Which is the smallest continent?', optionA: 'Europe', optionB: 'Antarctica', optionC: 'South America', optionD: 'Australia', correctOption: 'D', explanation: 'Australia is the smallest continent.' },
    { question: 'Mount Everest is located on the border of which two countries?', optionA: 'India & China', optionB: 'Nepal & China', optionC: 'Nepal & India', optionD: 'China & Pakistan', correctOption: 'B', explanation: 'Mount Everest is on the border of Nepal and China (Tibet).' },
    { question: 'What is the deepest ocean trench?', optionA: 'Java Trench', optionB: 'Puerto Rico Trench', optionC: 'Mariana Trench', optionD: 'Tonga Trench', correctOption: 'C', explanation: 'The Mariana Trench is the deepest oceanic trench at about 11,034 meters.' },
  ]);

  // ===== CURRENT AFFAIRS TESTS =====
  await createTest('Science & Technology News', 'Latest developments in science and tech', categories[7].id, 'medium', 480, [
    { question: 'Which company developed the ChatGPT AI model?', optionA: 'Google', optionB: 'Meta', optionC: 'OpenAI', optionD: 'Microsoft', correctOption: 'C', explanation: 'ChatGPT was developed by OpenAI.' },
    { question: 'What is the name of India\'s space agency?', optionA: 'NASA', optionB: 'ISRO', optionC: 'ESA', optionD: 'JAXA', correctOption: 'B', explanation: 'ISRO (Indian Space Research Organisation) is India\'s space agency.' },
    { question: 'Which country launched the Artemis moon mission?', optionA: 'China', optionB: 'Russia', optionC: 'USA', optionD: 'India', correctOption: 'C', explanation: 'NASA\'s Artemis program is the USA\'s mission to return to the Moon.' },
    { question: 'What is 5G technology?', optionA: '5th Generation wireless', optionB: '5 Gigabyte storage', optionC: '5th Generation processor', optionD: '5 Gigabit internet', correctOption: 'A', explanation: '5G is the 5th generation of cellular wireless technology.' },
    { question: 'Which planet did ISRO\'s Mangalyaan orbit?', optionA: 'Venus', optionB: 'Moon', optionC: 'Mars', optionD: 'Jupiter', correctOption: 'C', explanation: 'ISRO\'s Mars Orbiter Mission (Mangalyaan) successfully orbited Mars.' },
    { question: 'What is blockchain technology primarily known for?', optionA: 'Social media', optionB: 'Cryptocurrency', optionC: 'Gaming', optionD: 'Email', correctOption: 'B', explanation: 'Blockchain is the underlying technology behind cryptocurrencies like Bitcoin.' },
    { question: 'Which country successfully landed on the far side of the Moon in 2024?', optionA: 'USA', optionB: 'India', optionC: 'China', optionD: 'Russia', correctOption: 'C', explanation: 'China\'s Chang\'e-6 mission landed on the far side of the Moon in 2024.' },
    { question: 'What does AI stand for?', optionA: 'Automated Intelligence', optionB: 'Artificial Intelligence', optionC: 'Advanced Integration', optionD: 'Applied Information', correctOption: 'B', explanation: 'AI stands for Artificial Intelligence.' },
    { question: 'Which Indian mission successfully landed on the Moon\'s south pole?', optionA: 'Chandrayaan-2', optionB: 'Chandrayaan-3', optionC: 'Mangalyaan', optionD: 'Aditya-L1', correctOption: 'B', explanation: 'Chandrayaan-3 successfully landed near the Moon\'s south pole on August 23, 2023.' },
    { question: 'What is quantum computing?', optionA: 'Traditional computing', optionB: 'Computing using quantum mechanics', optionC: 'Cloud computing', optionD: 'Biological computing', correctOption: 'B', explanation: 'Quantum computing uses principles of quantum mechanics to process information.' },
  ]);

  await createTest('Sports & Awards', 'Test your knowledge of sports and achievements', categories[7].id, 'easy', 360, [
    { question: 'How many players are there in a cricket team?', optionA: '9', optionB: '10', optionC: '11', optionD: '12', correctOption: 'C', explanation: 'A cricket team has 11 players.' },
    { question: 'Which country has won the most FIFA World Cups?', optionA: 'Germany', optionB: 'Argentina', optionC: 'Brazil', optionD: 'Italy', correctOption: 'C', explanation: 'Brazil has won the most FIFA World Cups (5 times).' },
    { question: 'The Olympics are held every:', optionA: '2 years', optionB: '3 years', optionC: '4 years', optionD: '5 years', correctOption: 'C', explanation: 'The Olympic Games are held every 4 years.' },
    { question: 'Who is known as the "God of Cricket"?', optionA: 'Virat Kohli', optionB: 'Rahul Dravid', optionC: 'Sachin Tendulkar', optionD: 'MS Dhoni', correctOption: 'C', explanation: 'Sachin Tendulkar is often called the "God of Cricket" in India.' },
    { question: 'Which sport uses a shuttlecock?', optionA: 'Tennis', optionB: 'Table Tennis', optionC: 'Badminton', optionD: 'Squash', correctOption: 'C', explanation: 'Badminton is played with a shuttlecock.' },
    { question: 'The Bharat Ratna is India\'s:', optionA: 'Highest civilian award', optionB: 'Military award', optionC: 'Sports award', optionD: 'Science award', correctOption: 'A', explanation: 'Bharat Ratna is India\'s highest civilian award.' },
    { question: 'How many players are in a football (soccer) team on the field?', optionA: '9', optionB: '10', optionC: '11', optionD: '12', correctOption: 'C', explanation: 'A football team has 11 players on the field.' },
    { question: 'Which Indian cricketer has scored most international centuries?', optionA: 'Rohit Sharma', optionB: 'Virat Kohli', optionC: 'Sachin Tendulkar', optionD: 'Ricky Ponting', correctOption: 'C', explanation: 'Sachin Tendulkar has scored 100 international centuries.' },
    { question: 'The Nobel Prize is awarded in how many categories?', optionA: '4', optionB: '5', optionC: '6', optionD: '7', correctOption: 'C', explanation: 'Nobel Prizes are awarded in 6 categories: Physics, Chemistry, Medicine, Literature, Peace, and Economics.' },
    { question: 'Which country hosted the Cricket World Cup 2023?', optionA: 'England', optionB: 'Australia', optionC: 'India', optionD: 'South Africa', correctOption: 'C', explanation: 'India hosted the ICC Cricket World Cup 2023.' },
  ]);

  console.log('✅ Seeding completed successfully!');
  console.log(`📊 Created ${categories.length} categories with multiple tests and questions.`);
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
