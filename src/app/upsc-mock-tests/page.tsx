import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free UPSC CSE Prelims Mock Tests Online | TestWaleChacha',
  description: 'Practice free UPSC CSE Prelims mock tests covering GS Paper 1 and CSAT. Comprehensive questions on History, Geography, Polity, Economy, Science, and Current Affairs with detailed solutions.',
  openGraph: {
    title: 'Free UPSC CSE Prelims Mock Tests Online | TestWaleChacha',
    description: 'Practice free UPSC mock tests for CSE Prelims GS Paper 1 and CSAT with detailed solutions and real exam interface.',
    url: 'https://www.testwalechacha.online/upsc-mock-tests',
  },
};

const SITE_URL = 'https://www.testwalechacha.online';

export default function UPSCMockTestsPage() {
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
          Free UPSC CSE Prelims Mock Tests Online
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Practicing with exam-relevant mock tests is a critical part of UPSC Civil Services Examination preparation
        </p>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">The Role of Mock Tests in UPSC Preparation</h2>
            <p>
              The Union Public Service Commission (UPSC) Civil Services Examination is widely regarded as one of the most challenging competitive examinations in India, and arguably in the world. Each year, nearly 10 to 12 lakh candidates apply, approximately 5 to 6 lakh appear for the Preliminary examination, and only around 10,000 to 12,000 qualify for the Mains. With such staggering competition, relying solely on reading and note-taking is insufficient — you need the rigorous testing and feedback loop that mock tests provide.
            </p>
            <p className="mt-3">
              At TestWaleChacha, our UPSC mock tests are designed for the Preliminary stage, covering both General Studies Paper 1 (GS 1) and the Civil Services Aptitude Test (CSAT). Each mock test features a real exam-like interface with a countdown timer, a question palette for navigation, and thorough solutions with explanations. Practicing with these tests helps you develop the analytical thinking, elimination skills, and time management required to clear the UPSC Prelims cutoff.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">UPSC CSE Prelims: GS Paper 1</h2>
            <p>
              The General Studies Paper 1 is the qualifying paper that determines your progression to the Mains examination. It consists of 100 multiple-choice questions carrying 2 marks each, with a negative marking of 0.67 marks (one-third) for every wrong answer. The total duration is 2 hours. The GS Paper 1 covers a vast and diverse syllabus that spans multiple disciplines.
            </p>
            <p className="mt-3">
              Unlike many other competitive exams, UPSC questions are not straightforward recall-based questions. They test your conceptual understanding, ability to interlink topics, and capacity to eliminate incorrect options. For example, a single question might combine knowledge of Indian geography, monsoon patterns, and agricultural practices. This is why reading alone is not enough — you need the practice of applying your knowledge under timed conditions, which is exactly what our mock tests provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">CSAT (General Studies Paper 2)</h2>
            <p>
              The Civil Services Aptitude Test is a qualifying paper, meaning you need to score a minimum of 33% (approximately 66 marks out of 200). Despite being qualifying in nature, CSAT should not be neglected — many candidates fail to clear this threshold. The paper consists of 80 questions carrying 2.5 marks each, with a negative marking of 0.83 marks per wrong answer.
            </p>
            <p className="mt-3">
              CSAT tests reading comprehension (the highest weightage section), logical and analytical reasoning, data interpretation, basic numeracy (up to class 10 level), decision-making, and general mental ability. The reading comprehension passages are typically drawn from diverse fields including science, philosophy, economics, and public administration. Our CSAT mock tests on TestWaleChacha include a variety of comprehension passages and reasoning puzzles that reflect the actual UPSC difficulty level.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">Eligibility for UPSC CSE</h3>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Bachelor&apos;s degree from a recognized university (final year students may also apply)</li>
              <li>Age limit: 21 to 32 years for General category (relaxation for OBC, SC/ST, and others)</li>
              <li>Number of attempts: 6 for General, 9 for OBC, unlimited for SC/ST</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Subjects in UPSC GS Paper 1</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Indian History and Art and Culture</h3>
            <p className="mb-3">
              Ancient, Medieval, and Modern Indian History form a substantial portion of the GS Paper 1. Important areas include the Indus Valley Civilization, Mauryan and Gupta empires, Delhi Sultanate, Mughal Empire, and the freedom struggle. Post-independence India, including the integration of princely states and the five-year plans, is increasingly being tested. Art and Culture questions cover Indian architecture, painting traditions, music forms, dance, literature, and religious movements. Our mock tests include questions that test your understanding of historical events and cultural concepts rather than rote memorization of dates and facts.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Geography (Indian and World)</h3>
            <p className="mb-3">
              Geography questions in UPSC cover physical geography (geomorphology, climatology, oceanography, biogeography), Indian geography (physiography, drainage, climate, soil, natural vegetation, mineral resources), and human geography (population, settlement, migration). Map-based questions have become increasingly common in recent years. Environmental geography, including biodiversity, climate change, and environmental conventions, is another high-yield area.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Indian Polity and Governance</h3>
            <p className="mb-3">
              Indian Polity questions cover the Constitution of India (fundamental rights, directive principles, fundamental duties), the three organs of government (legislature, executive, judiciary), federalism, center-state relations, constitutional bodies (Election Commission, CAG, UPSC, Finance Commission), and statutory bodies (NHRC, CIC, CBI). Questions on governance, social justice, and international relations are also included. Recent trends show an increased focus on current events related to polity, such as amendments, new bills, and landmark Supreme Court judgments.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Economy and Social Development</h3>
            <p className="mb-3">
              Economy questions test your understanding of basic economic concepts (GDP, inflation, fiscal and monetary policy, banking), Indian economy (planning, NITI Aayog, economic reforms, budget), and government schemes (MUDRA, PM-KISAN, Atal Mission for Rejuvenation and Urban Transformation). Social development topics include poverty, inequality, health, education, and sustainable development. Current economic developments and government policy decisions form a significant portion of the economy questions.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Science and Technology, Environment, and Current Affairs</h3>
            <p>
              Science and Technology questions cover general science (physics, chemistry, biology basics), space technology, biotechnology, information technology, defense technology, and nuclear energy. Environment questions include biodiversity, conservation, pollution, climate change, and international environmental agreements. Current Affairs is the thread that connects all subjects — UPSC increasingly frames questions around current events, testing whether you can connect them to the underlying static syllabus. Our mock tests incorporate current affairs-linked questions across all subjects to help you develop this crucial skill.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">UPSC Mains: A Brief Overview</h2>
            <p>
              While TestWaleChacha currently focuses on Prelims mock tests, it is important to understand the full examination structure. The UPSC Mains consists of nine papers, including the Essay paper, four General Studies papers (GS 1 through GS 4), two Optional Subject papers, and two language papers (one qualifying Indian language and English). The Mains is a written descriptive examination that tests not just knowledge but also your ability to present arguments coherently, analyze issues from multiple perspectives, and write within word limits. The knowledge and analytical skills you build through Prelims mock tests form the foundation for Mains preparation as well.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Use UPSC Mock Tests Effectively</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Start taking mock tests 2-3 months before the Prelims date — earlier if your syllabus revision is complete</li>
              <li>Aim for at least 15-20 full-length mock tests before the actual exam</li>
              <li>Practice elimination techniques — in UPSC, eliminating two wrong options often leads to the correct answer</li>
              <li>Analyze each mock test to identify which subjects and question types are costing you marks</li>
              <li>Do not chase high attempt rates — focus on accuracy, as negative marking can significantly reduce your score</li>
              <li>Time yourself strictly to build the discipline of moving on from difficult questions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">TestWaleChacha Features for UPSC Preparation</h2>
            <p>
              Our UPSC mock tests feature a real exam interface with a countdown timer, question palette, and the ability to mark questions for review — exactly as in the actual UPSC CBT. After submission, detailed solutions provide explanations and relevant contextual information for each question. This allows you to not only assess your current preparation level but also learn new facts and concepts through the solution analysis. For an examination as vast as the UPSC CSE, this dual benefit of assessment and learning makes mock test practice indispensable.
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
                <a href={`${SITE_URL}/state-psc-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free State PSC Mock Tests Online — BPSC, MPPSC, UPPSC
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/defence-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free CDS, NDA Mock Tests Online
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/ssc-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free SSC CGL, CHSL, MTS Mock Tests Online
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
