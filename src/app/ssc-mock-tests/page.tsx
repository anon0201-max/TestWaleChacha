import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free SSC CGL, CHSL, MTS Mock Tests Online | TestWaleChacha',
  description: 'Practice free SSC CGL, CHSL, MTS, GD, and Stenographer mock tests online. Real exam interface with timer, question palette, and detailed solutions. Start your SSC preparation today.',
  openGraph: {
    title: 'Free SSC CGL, CHSL, MTS Mock Tests Online | TestWaleChacha',
    description: 'Practice free SSC CGL, CHSL, MTS, GD, and Stenographer mock tests online with real exam interface and detailed solutions.',
    url: 'https://www.testwalechacha.online/ssc-mock-tests',
  },
};

const SITE_URL = 'https://www.testwalechacha.online';

export default function SSCMockTestsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium mb-8 transition-colors"
        >
          &larr; Back to TestWaleChacha
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Free SSC CGL, CHSL, MTS Mock Tests Online
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Comprehensive practice platform for all Staff Selection Commission examinations
        </p>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why SSC Mock Tests Are Essential for Your Preparation</h2>
            <p>
              The Staff Selection Commission (SSC) conducts some of the most sought-after competitive examinations in India, attracting millions of aspirants every year. Whether you are preparing for SSC CGL, SSC CHSL, SSC MTS, SSC GD Constable, or SSC Stenographer, a structured mock test practice is the single most effective way to convert your knowledge into exam-ready performance. At TestWaleChacha, our SSC mock tests are designed to replicate the actual exam environment with a real exam interface, countdown timer, question palette for navigation, and detailed solutions after every test.
            </p>
            <p className="mt-3">
              Mock tests help you identify weak areas, improve speed and accuracy, and build the mental stamina required to sit through a two-hour computer-based examination. Many candidates who clear SSC exams attribute their success to consistent mock test practice in the final months of preparation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">SSC CGL Mock Tests</h2>
            <p>
              The SSC Combined Graduate Level (CGL) examination is one of the most popular government job exams in India. It is conducted in two tiers — Tier 1 and Tier 2. Tier 1 consists of 100 multiple-choice questions to be answered in 60 minutes, covering four subjects: General Intelligence and Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension. Each question carries 2 marks, with a negative marking of 0.50 marks for wrong answers.
            </p>
            <p className="mt-3">
              Tier 2 is a descriptive and objective combination that tests deeper subject knowledge. Our SSC CGL mock tests on TestWaleChacha mirror the Tier 1 pattern precisely, allowing you to practice under realistic time constraints. After each test, you can review every question with detailed explanations, helping you understand the correct approach for tricky topics like profit and loss, number series, sentence rearrangement, and Indian polity.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">Eligibility for SSC CGL</h3>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Bachelor&apos;s degree from a recognized university</li>
              <li>Age limit: 18 to 32 years (varies by post)</li>
              <li>Citizenship of India, Nepal, or Bhutan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">SSC CHSL Mock Tests</h2>
            <p>
              The SSC Combined Higher Secondary Level (CHSL) examination is the gateway to government jobs for candidates who have completed their 10+2 education. The exam consists of Tier 1 (objective) and Tier 2 (descriptive and skill test). Tier 1 includes 100 questions across four sections — English Language, General Intelligence, Quantitative Aptitude, and General Awareness — with a total time of 60 minutes.
            </p>
            <p className="mt-3">
              SSC CHSL sees heavy competition, with the number of applicants often exceeding several million. Practicing with SSC CHSL mock tests on TestWaleChacha helps you get familiar with the question difficulty level, learn time management, and build confidence. Our platform provides section-wise analysis after every attempt so you can track your progress across all four subjects over time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">SSC MTS, GD, and Stenographer Mock Tests</h2>
            <p>
              Beyond CGL and CHSL, the SSC conducts several other important examinations. The SSC MTS (Multi-Tasking Staff) exam is ideal for candidates with a matriculation (10th pass) qualification. It includes a Computer Based Examination with questions on General Intelligence and Reasoning, Numerical Aptitude, General English, and General Awareness. The SSC GD Constable exam focuses on General Intelligence, General Knowledge, Elementary Mathematics, and English/Hindi. The SSC Stenographer exam tests candidates on General Intelligence, General Awareness, English Language, and Comprehension.
            </p>
            <p className="mt-3">
              Each of these exams has its own unique pattern and difficulty level. TestWaleChacha offers dedicated mock tests for SSC MTS, SSC GD, and SSC Stenographer so that you can practice with exam-specific question sets rather than generic ones. Every mock test includes a timer, a question palette to jump between questions, and complete solutions for self-evaluation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Subjects Covered in SSC Mock Tests</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">General Intelligence and Reasoning</h3>
            <p className="mb-3">
              This section tests your logical and analytical ability. Topics include analogies, classification, series completion, coding-decoding, blood relations, direction sense, syllogism, venn diagrams, and non-verbal reasoning (pattern recognition, mirror images, paper folding). Consistent practice through mock tests helps you recognize patterns quickly and solve these questions within seconds.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Quantitative Aptitude</h3>
            <p className="mb-3">
              The quantitative section covers arithmetic (percentages, profit and loss, simple and compound interest, time and work, time and distance, averages, ratios), algebra, geometry, trigonometry, and data interpretation. Many SSC aspirants find this section challenging because of the variety of topics and the speed required. Our mock tests include a balanced mix of easy, moderate, and difficult questions reflecting the actual exam trend.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">English Comprehension</h3>
            <p className="mb-3">
              English questions test your grammar, vocabulary, and reading comprehension. Common topics include error spotting, fill in the blanks, synonyms and antonyms, one-word substitution, idioms and phrases, sentence improvement, active and passive voice, direct and indirect speech, and reading comprehension passages. Our SSC mock tests include vocabulary-heavy questions that reflect the current SSC trend.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">General Awareness</h3>
            <p>
              General Awareness in SSC exams covers Indian History, Geography, Polity, Economy, General Science (Physics, Chemistry, Biology), and Current Affairs. Static GK forms the majority of questions, but recent years have seen an increase in current affairs questions. Our mock tests are regularly updated to include relevant current affairs and reflect the latest question trends observed in actual SSC examinations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Make the Most of Your SSC Mock Test Practice</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Start with subject-wise tests to build confidence in individual topics</li>
              <li>Gradually move to full-length mock tests to simulate the real exam experience</li>
              <li>Analyze every test thoroughly — spend as much time reviewing solutions as taking the test itself</li>
              <li>Track your accuracy and speed across sections to identify improvement areas</li>
              <li>Focus on reducing negative marking by avoiding guesswork on uncertain questions</li>
              <li>Take at least 2-3 full mock tests per week in the final month before the exam</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">TestWaleChacha Features for SSC Preparation</h2>
            <p>
              Every SSC mock test on TestWaleChacha comes with a real exam-like interface that includes a countdown timer, a color-coded question palette showing answered, unanswered, and marked-for-review questions, and the ability to navigate freely between questions. After submitting a test, you receive detailed solutions for every question with step-by-step explanations. This combination of realistic practice and thorough analysis makes TestWaleChacha an effective tool for serious SSC aspirants.
            </p>
          </section>

          <div className="mt-10 text-center">
            <Link
              href={SITE_URL}
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Browse All Mock Tests
            </Link>
          </div>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Exam Categories</h2>
            <ul className="space-y-2">
              <li>
                <a href={`${SITE_URL}/banking-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free IBPS PO, SBI PO, Clerk Mock Tests Online
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/railway-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free RRB NTPC, Group D Mock Tests Online
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/upsc-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free UPSC CSE Prelims Mock Tests Online
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/general-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free General Studies, GK, Current Affairs Mock Tests
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TestWaleChacha. All rights reserved.
        </div>
      </div>
    </main>
  );
}
