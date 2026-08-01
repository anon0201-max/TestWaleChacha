import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free RRB NTPC, Group D Mock Tests Online | TestWaleChacha',
  description: 'Practice free RRB NTPC, RRB Group D, RRB ALP, and RRB JE mock tests online. Real exam interface with timer, question palette, and detailed solutions for railway exam preparation.',
  openGraph: {
    title: 'Free RRB NTPC, Group D Mock Tests Online | TestWaleChacha',
    description: 'Practice free railway mock tests for RRB NTPC, Group D, ALP, and JE with real exam interface and detailed solutions.',
    url: 'https://test-wale-chacha.vercel.app/railway-mock-tests',
  },
};

const SITE_URL = 'https://test-wale-chacha.vercel.app';

export default function RailwayMockTestsPage() {
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
          Free RRB NTPC, Group D Mock Tests Online
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Comprehensive mock test platform for Railway Recruitment Board examinations
        </p>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why Railway Exam Mock Tests Matter</h2>
            <p>
              The Railway Recruitment Board (RRB) examinations are among the largest competitive exams conducted in India, with the RRB NTPC and RRB Group D exams alone attracting over one crore applications each cycle. Railway jobs offer stable career opportunities, benefits, and the prestige of working with one of the world&apos;s largest rail networks. Given the sheer volume of competition, structured mock test practice becomes not just helpful but essential for serious aspirants.
            </p>
            <p className="mt-3">
              At TestWaleChacha, our railway mock tests are designed to closely replicate the Computer Based Test (CBT) format used by RRB. Each test includes a real exam interface with a countdown timer, a question palette that shows the status of every question (answered, unanswered, marked for review), and detailed solutions provided after submission. This realistic simulation helps you manage exam anxiety and develop the time management skills needed to attempt the maximum number of questions accurately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">RRB NTPC Mock Tests</h2>
            <p>
              The RRB NTPC (Non-Technical Popular Categories) examination is conducted in multiple stages. CBT 1 consists of 100 questions to be attempted in 90 minutes, covering General Awareness (40 questions), Mathematics (30 questions), and General Intelligence and Reasoning (30 questions). Each question carries 1 mark, and there is a negative marking of 0.33 marks for every wrong answer.
            </p>
            <p className="mt-3">
              Candidates who qualify CBT 1 appear for CBT 2, which has 120 questions across the same three sections but with a greater emphasis on General Awareness (50 questions), Mathematics (35 questions), and Reasoning (35 questions). The CBT 2 is more difficult and requires deeper subject knowledge. Our RRB NTPC mock tests on TestWaleChacha cover both CBT 1 and CBT 2 patterns, allowing you to practice at both difficulty levels. Each test includes topic-wise analysis so you can pinpoint exactly where your preparation needs more work.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">Eligibility for RRB NTPC</h3>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Graduate degree from a recognized university for most posts</li>
              <li>Age limit: 18 to 33 years (varies by post category)</li>
              <li>For certain posts, a 12th pass qualification may be sufficient</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">RRB Group D Mock Tests</h2>
            <p>
              The RRB Group D examination is designed for recruitment to Level 1 posts in the railway hierarchy, including Track Maintainer, Helper, Assistant, and Pointsman. The eligibility requirement is a 10th pass (matriculation) or ITI qualification. The CBT consists of 100 questions across four sections: General Science (25 questions), Mathematics (25 questions), General Intelligence and Reasoning (30 questions), and General Awareness and Current Affairs (20 questions). The total duration is 90 minutes with a negative marking of 0.33 marks per wrong answer.
            </p>
            <p className="mt-3">
              The General Science section in RRB Group D is particularly important and covers Physics, Chemistry, and Biology at the 10th standard level. Many aspirants underestimate this section, but it can be a high-scoring area with proper preparation. Our RRB Group D mock tests include a well-balanced mix of science questions alongside the standard reasoning, math, and GK sections. The detailed solutions explain scientific concepts in simple terms, making them accessible even to candidates who may not have a strong science background.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">RRB ALP and RRB JE Mock Tests</h2>
            <p>
              The RRB ALP (Assistant Loco Pilot) and RRB JE (Junior Engineer) examinations are technical in nature. The ALP exam includes a first-stage CBT covering Mathematics, General Intelligence and Reasoning, General Science, and General Awareness on Current Affairs. The second stage CBT includes Part A (similar to the first stage but with more questions) and Part B (trade-specific technical questions). The JE exam is designed for engineering graduates and includes questions on Technical Abilities, General Awareness, Physics and Chemistry, Basics of Computers, and Basics of Environment and Pollution Control.
            </p>
            <p className="mt-3">
              TestWaleChacha offers mock tests for both the non-technical portions of the ALP and JE examinations. These tests help you prepare for the common sections that appear across railway exams — Mathematics, Reasoning, General Science, and Current Affairs. For candidates preparing for RRB ALP or RRB JE, building a strong foundation in these shared sections is crucial before focusing on the trade-specific technical portion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Subjects in Railway Mock Tests</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Mathematics</h3>
            <p className="mb-3">
              Railway exam mathematics is generally at a slightly easier level compared to banking or SSC exams. Key topics include number system, decimals, fractions, LCM and HCF, ratio and proportions, percentages, mensuration, time and work, time and distance, simple and compound interest, profit and loss, algebra, geometry, and trigonometry. The questions test fundamental understanding rather than advanced problem-solving, making accuracy the key differentiator.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">General Intelligence and Reasoning</h3>
            <p className="mb-3">
              The reasoning section covers analogies, classification, series (number and alphabetical), coding-decoding, blood relations, direction sense, ranking, venn diagrams, syllogism, statement and conclusions, statement and assumptions, and non-verbal reasoning including mirror images, water images, and paper folding. Railway reasoning questions tend to be straightforward but require quick recognition of patterns.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">General Science</h3>
            <p className="mb-3">
              This is a distinctive feature of railway examinations. Questions are drawn from Physics (laws of motion, optics, electricity, magnetism, heat), Chemistry (atoms, molecules, chemical reactions, acids and bases, metals and non-metals), and Biology (cell structure, human body systems, diseases, nutrition, plant physiology). The difficulty level corresponds to the 10th standard NCERT science curriculum.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">General Awareness and Current Affairs</h3>
            <p>
              General Awareness questions in railway exams cover Indian History, Geography, Polity, Economy, and Culture, along with current affairs of national and international importance. Recent years have seen an increased focus on current affairs, railway-related awareness (important trains, railway zones, rail budget highlights), and static GK. Our mock tests are updated regularly to include relevant current affairs and reflect the latest question patterns observed in RRB examinations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Tips for Railway Exam Preparation</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Focus on NCERT science textbooks (Class 6-10) for the General Science section</li>
              <li>Practice calculations daily to improve speed in the Mathematics section</li>
              <li>Take full-length mock tests at least twice a week to build stamina and time management</li>
              <li>Review each mock test thoroughly — understanding why an answer is wrong is as important as knowing the right answer</li>
              <li>Stay consistent with current affairs preparation through daily news summaries</li>
              <li>Pay special attention to railway-specific general knowledge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">TestWaleChacha Features for Railway Exam Practice</h2>
            <p>
              Every railway mock test on TestWaleChacha is built with a real exam-like interface featuring a countdown timer, a color-coded question palette, and the ability to navigate freely between questions. After submitting your test, you receive detailed solutions with explanations for every question. This systematic approach to practice and analysis helps you track improvement over time and focus your efforts on the areas that will have the greatest impact on your score.
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
                <a href={`${SITE_URL}/ssc-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free SSC CGL, CHSL, MTS Mock Tests Online
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/banking-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free IBPS PO, SBI PO, Clerk Mock Tests Online
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/defence-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free CDS, NDA Mock Tests Online
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
