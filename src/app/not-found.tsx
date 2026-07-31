import Link from 'next/link';
import { BookOpen, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">Page Not Found</h2>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Yeh page exist nahi karti ya shift ho gayi hogi. Chalo wapas home page pe jaate hain aur mock tests shuru karte hain!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" /> Home Page
          </Link>
          <Link
            href="/?view=tests"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Browse Tests
          </Link>
        </div>
      </div>
    </div>
  );
}
