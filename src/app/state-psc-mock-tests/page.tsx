import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free State PSC Mock Tests Online - BPSC, MPPSC, UPPSC | TestWaleChacha',
  description: 'Practice free State PSC mock tests for BPSC, MPPSC, UPPSC, RPSC, and HPSC. Covers Prelims and Mains pattern with History, Geography, Polity, Economy, and state-specific GK.',
  openGraph: {
    title: 'Free State PSC Mock Tests Online - BPSC, MPPSC, UPPSC | TestWaleChacha',
    description: 'Practice free State PSC mock tests for BPSC, MPPSC, UPPSC, RPSC, and HPSC with real exam interface and detailed solutions.',
    url: 'https://test-wale-chacha.vercel.app/state-psc-mock-tests',
  },
};

const SITE_URL = 'https://test-wale-chacha.vercel.app';

export default function StatePSCMockTestsPage() {
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
          Free State PSC Mock Tests Online — BPSC, MPPSC, UPPSC
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Targeted practice for all major State Public Service Commission examinations in India
        </p>
        <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px]">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Understanding State PSC Examinations</h2>
            <p>
              State Public Service Commissions (PSCs) are constitutional bodies established under Article 315 of the Indian Constitution, responsible for recruiting candidates to various civil service positions within their respective states. These positions include Deputy Collector, Deputy Superintendent of Police, Block Development Officer, Revenue Officer, and a range of other Group A and Group B administrative roles. State PSC examinations follow a structure similar to the UPSC Civil Services Examination, typically comprising a Preliminary examination (objective type), a Mains examination (descriptive type), and a personality test or interview.
            </p>
            <p className="mt-3">
              While the core syllabus overlaps significantly with UPSC — covering Indian History, Geography, Polity, Economy, General Science, and Current Affairs — each state PSC also includes state-specific subjects such as the state&apos;s history, geography, culture, and current developments. This dual requirement of national-level general studies and state-specific knowledge makes State PSC preparation a specialized endeavor. At TestWaleChacha, our State PSC mock tests are designed to address both dimensions, helping you build a comprehensive preparation strategy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">BPSC Mock Tests</h2>
            <p>
              The Bihar Public Service Commission (BPSC) conducts the Combined Competitive Examination for recruitment to various administrative posts in Bihar. The examination pattern has evolved over the years. The Preliminary examination consists of General Studies questions covering a broad range of subjects. The Mains examination includes a General Hindi paper, a General Studies Paper 1, a General Studies Paper 2, and an optional subject paper. The interview follows for candidates who qualify the Mains.
            </p>
            <p className="mt-3">
              Bihar-specific topics tested in BPSC include the history of ancient and medieval Bihar (Magadh, Mauryan Empire, Nalanda, Vikramshila), the geography of Bihar (rivers, climate, mineral resources, agriculture), Bihar&apos;s role in the freedom struggle (Champaran Satyagraha), and current affairs related to Bihar&apos;s development, government schemes, and political developments. Our BPSC mock tests include questions on these state-specific areas alongside the standard general studies subjects.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-5 mb-2">Eligibility for BPSC</h3>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Graduate degree from a recognized university</li>
              <li>Age limit: 20 to 37 years for General category (varies by post)</li>
              <li>Candidate must be a citizen of India and a resident of Bihar (domicile requirements may apply)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">MPPSC and UPPSC Mock Tests</h2>
            <p>
              The Madhya Pradesh Public Service Commission (MPPSC) conducts the State Service Examination for Group A and Group B posts in Madhya Pradesh. The Prelims consists of two papers — General Studies and General Aptitude Test — each carrying 200 marks. The Mains includes six papers covering General Studies (four papers), Hindi essay, and Hindi grammar. The MPPSC syllabus includes Madhya Pradesh-specific topics such as the state&apos;s history (Maratha rule, princely states, freedom movement), geography (forests, national parks, rivers, mineral resources), art and culture (tribal heritage, folk traditions, historical monuments), and current developments.
            </p>
            <p className="mt-3">
              The Uttar Pradesh Public Service Commission (UPPSC) conducts the Combined State/Upper Subordinate Services Examination, commonly known as the UPPCS examination. The Prelims includes two papers: General Studies I and General Studies II (CSAT, qualifying). The Mains is extensive, comprising eight papers including General Studies (four papers), Essay, General Hindi, and an optional subject. UPPSC is known for testing deep conceptual understanding, and the question quality is often compared to UPSC. Uttar Pradesh-specific topics include the history of Awadh, the freedom movement in UP, the geography of the Gangetic plain, and the state&apos;s cultural and political significance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">RPSC, HPSC, and Other State PSC Exams</h2>
            <p>
              The Rajasthan Public Service Commission (RPSC) conducts the Rajasthan Administrative Service (RAS) examination. The Prelims consists of one General Studies and General Knowledge paper, while the Mains includes four papers covering General Studies, General Knowledge, and optional subjects. Rajasthan-specific topics include the history of Rajputana, the Thar Desert, Rajasthani culture, art, and folk traditions, as well as the state&apos;s geography, water resources, and mineral wealth.
            </p>
            <p className="mt-3">
              The Haryana Public Service Commission (HPSC) conducts the Haryana Civil Services examination. The pattern is similar to other state PSCs, with a Prelims, Mains, and Interview. Haryana-specific content includes the state&apos;s history, geography, agricultural economy, and cultural heritage. Other notable State PSCs include MPPSC (Madhya Pradesh), OPSC (Odisha), APPSC (Andhra Pradesh), TSPSC (Telangana), JPSC (Jharkhand), and WBPSC (West Bengal). While each has unique state-specific elements, the general studies foundation remains consistent across all of them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Subjects Covered in State PSC Mock Tests</h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">History, Geography, and Polity</h3>
            <p className="mb-3">
              The history syllabus for State PSCs covers Ancient India (Indus Valley Civilization, Vedic period, Mauryan and Gupta empires, South Indian kingdoms), Medieval India (Delhi Sultanate, Mughal Empire, Vijayanagara, Marathas), and Modern India (British colonial rule, freedom struggle, social reform movements). Geography includes physical geography of India and the world, Indian geography (physiography, climate, drainage, agriculture, minerals), and state-specific geographical features. Polity covers the Indian Constitution, governance, political system, Panchayati Raj, and state-specific administrative structures.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Economy, Science, and Current Affairs</h3>
            <p className="mb-3">
              Economy questions test your understanding of Indian economic development, planning, budget, banking, and state-specific economic conditions (agricultural output, industries, per capita income, poverty indicators). General Science covers physics, chemistry, biology, and environmental science at a level appropriate for competitive examinations. Current Affairs is increasingly important in State PSCs, with questions on national events, international developments, government schemes, and state-specific news.
            </p>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">State-Specific General Knowledge</h3>
            <p>
              This is what differentiates State PSC preparation from UPSC preparation. Every state exam includes questions on the state&apos;s history, geography, culture, literature, art forms, famous personalities, festivals, rivers, mountains, national parks, and administrative structure. The weightage of state-specific content varies from exam to exam but typically accounts for 20 to 35 percent of the total questions. Our State PSC mock tests include a dedicated focus on state-relevant content to help you prepare for this unique component.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">State PSC Preparation Strategy</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Build a strong general studies foundation using NCERT textbooks (Class 6-12)</li>
              <li>Prepare state-specific content from dedicated state GK books and government websites</li>
              <li>Stay updated with both national and state-level current affairs</li>
              <li>Take regular mock tests to assess your preparation and improve time management</li>
              <li>Analyze previous year question papers to understand the exam pattern and question trends</li>
              <li>For the Mains, practice answer writing regularly to develop speed and structure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">TestWaleChacha Features for State PSC Practice</h2>
            <p>
              Our State PSC mock tests are built with a real exam interface featuring a countdown timer, a color-coded question palette for efficient navigation, and detailed solutions after submission. Each test is designed to balance national-level general studies with state-specific content, reflecting the actual pattern observed in State PSC examinations. The solution explanations include relevant context and additional information, turning each mock test into both an assessment tool and a learning resource.
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
                <a href={`${SITE_URL}/ssc-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free SSC CGL, CHSL, MTS Mock Tests Online
                </a>
              </li>
              <li>
                <a href={`${SITE_URL}/teaching-mock-tests`} className="text-emerald-600 hover:text-emerald-700 underline">
                  Free CTET, TET, Super TET Mock Tests Online
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
