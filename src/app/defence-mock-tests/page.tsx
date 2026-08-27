import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free CDS, NDA Mock Tests Online | TestWaleChacha',
  description: 'Practice free CDS and NDA mock tests online for Army, Navy, and Air Force academies. Covers English, General Knowledge, Mathematics, and Elementary Science with detailed solutions.',
  openGraph: {
    title: 'Free CDS, NDA Mock Tests Online | TestWaleChacha',
    description: 'Practice free defence mock tests for CDS and NDA with real exam interface, timer, and detailed solutions.',
    url: 'https://www.testwalechacha.online/defence-mock-tests',
  },
};

const SITE_URL = 'https://www.testwalechacha.online';

export default function DefenceMockTestsPage() {
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
          Free CDS, NDA Mock Tests Online
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Prepare for the Indian Armed Forces with comprehensive mock tests for CDS and NDA examinations
        </p>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why Defence Examination Mock Tests Are Crucial</h2>
            <p>
              A career in the Indian Armed Forces — whether through the Indian Military Academy (IMA), Indian Naval Academy (INA), Air Force Academy (AFA), or the National Defence Academy (NDA) — is one of the most prestigious paths a young Indian can choose. The Union Public Service Commission (UPSC) conducts the Combined Defence Services (CDS) examination twice a year for graduate-level entry, and the NDA examination for candidates who have completed or are appearing in their 10+2 (Class 12) board examinations.
            </p>
            <p className="mt-3">
              Both examinations are highly competitive. The CDS examination sees several lakh applicants for a few hundred vacancies, and the NDA examination is similarly competitive. Unlike many other competitive exams, the CDS and NDA have unique subject combinations — particularly the Mathematics paper in NDA and the Elementary Mathematics paper in CDS — that require dedicated practice. At TestWaleChacha, our defence mock tests are tailored to the specific patterns of the CDS and NDA examinations, featuring a real exam interface with a countdown timer, question palette, and detailed solutions to help you prepare effectively.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">CDS Examination Mock Tests</h2>
            <p>
              The Combined Defence Services (CDS) examination is conducted for admission to the Indian Military Academy (IMA), Indian Naval Academy (INA), Air Force Academy (AFA), and Officers&apos; Training Academy (OTA). The written examination consists of three papers for IMA, INA, and AFA aspirants: English (100 marks, 2 hours), General Knowledge (100 marks, 2 hours), and Elementary Mathematics (100 marks, 2 hours). For OTA aspirants, only the English and General Knowledge papers are required.
            </p>
            <p className="mt-3">
              The English paper tests grammar, vocabulary, comprehension, sentence arrangement, antonyms, synonyms, and spotting errors. The General Knowledge paper covers a wide range of topics including Indian History, Geography, Indian Polity, Economy, General Science, and Current Affairs. Defence-specific knowledge — such as military exercises, defence acquisitions, ranks, and organizational structure of the Indian Armed Forces — is also tested. The Elementary Mathematics paper covers arithmetic, algebra, geometry, trigonometry, mensuration, and statistics at the secondary school level.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">Eligibility for CDS</h3>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>IMA and OTA: Bachelor&apos;s degree in any discipline from a recognized university</li>
              <li>INA: Bachelor&apos;s degree in Engineering or B.Sc. with Physics and Mathematics</li>
              <li>AFA: Bachelor&apos;s degree with Physics and Mathematics at 10+2 level, or Bachelor of Engineering</li>
              <li>Age limit: 19 to 25 years (varies by academy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">NDA Examination Mock Tests</h2>
            <p>
              The National Defence Academy (NDA) examination is conducted twice a year for admission to the Army, Navy, and Air Force wings of the NDA. The written examination consists of two papers: Mathematics (300 marks, 2.5 hours) and General Ability Test (600 marks, 2.5 hours). The General Ability Test is further divided into two parts — Part A (English, 200 marks) and Part B (General Knowledge, 400 marks).
            </p>
            <p className="mt-3">
              The Mathematics paper in NDA is notably more advanced than the CDS Elementary Mathematics paper. It covers algebra (quadratic equations, matrices, determinants, logarithms), trigonometry (identities, inverse trigonometric functions, heights and distances), analytical geometry of two and three dimensions, differential calculus, integral calculus, vector algebra, statistics, and probability. The difficulty level is comparable to the Class 12 CBSE syllabus, and questions often test conceptual understanding and problem-solving ability rather than straightforward computation.
            </p>
            <p className="mt-3">
              The General Knowledge section in NDA covers Physics, Chemistry, General Science, Social Studies (History, Geography, Civics), and Current Affairs. Each of these sub-sections carries a specific weightage, with Physics typically having the highest number of questions. The English section tests grammar, vocabulary, comprehension, and usage, similar to the CDS English paper but with a slightly different emphasis given the candidate&apos;s younger age profile.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">Eligibility for NDA</h3>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Army wing: 10+2 pass with any subject combination from a recognized board</li>
              <li>Navy and Air Force wings: 10+2 pass with Physics and Mathematics</li>
              <li>Age limit: 16.5 to 19.5 years at the time of course commencement</li>
              <li>Unmarried male and female candidates are eligible (as per current rules)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Subjects in Defence Mock Tests</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">English Language</h3>
            <p className="mb-3">
              English is a critical component of both CDS and NDA examinations. The questions test reading comprehension, fill in the blanks, synonyms and antonyms, spot the error, sentence improvement, ordering of words in a sentence, one-word substitution, idioms and phrases, and cloze tests. In CDS, the English paper is a standalone 100-mark paper, while in NDA, it forms Part A of the General Ability Test worth 200 marks. A strong command of English grammar and vocabulary is essential, and our mock tests include a diverse range of question types at the appropriate difficulty level.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">General Knowledge</h3>
            <p className="mb-3">
              General Knowledge in defence exams is broader than in most other competitive examinations. It includes Indian History (with emphasis on modern India and the freedom struggle), Geography (physical, Indian, and world), Indian Polity (constitution, governance), Economy (basic concepts and current economic developments), General Science (physics, chemistry, biology at the 10+2 level for NDA and 10th level for CDS), and Defence Studies. Defence-related questions may cover military history, important battles, defence organizations (DRDO, ISRO, BARC), and current developments in India&apos;s defence sector.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Mathematics (NDA) and Elementary Mathematics (CDS)</h3>
            <p>
              The NDA Mathematics paper is the most challenging quantitative section among all Indian defence examinations. It requires a thorough understanding of Class 11 and 12 mathematics, including calculus, coordinate geometry, and vectors. The CDS Elementary Mathematics paper, while less advanced, still requires solid fundamentals in arithmetic, algebra, geometry, trigonometry, and mensuration. Our defence mock tests include separate question sets for NDA-level and CDS-level mathematics, ensuring you practice at the right difficulty level for your target examination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Preparation Tips for Defence Examinations</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>For NDA Mathematics, practice NCERT Class 11 and 12 textbooks thoroughly</li>
              <li>For CDS Mathematics, focus on Class 10 level arithmetic, algebra, and geometry</li>
              <li>Build a strong vocabulary through daily word lists and reading newspapers</li>
              <li>Stay updated with current affairs, especially defence-related developments</li>
              <li>Take full-length mock tests regularly to build speed and exam temperament</li>
              <li>Focus on accuracy in GK — avoid guesswork due to negative marking in both exams</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">TestWaleChacha Features for Defence Exam Practice</h2>
            <p>
              Every defence mock test on TestWaleChacha uses a real exam-like interface with a countdown timer, a color-coded question palette for navigation, and detailed solutions after submission. The solutions for mathematics questions include step-by-step working, while GK solutions provide relevant context and background information. This approach ensures that each mock test serves as both an assessment tool and a learning opportunity, helping you progressively improve your preparation for the CDS or NDA examination.
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
                <a href={`${SITE_URL}/upsc-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free UPSC CSE Prelims Mock Tests Online
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/railway-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free RRB NTPC, Group D Mock Tests Online
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
