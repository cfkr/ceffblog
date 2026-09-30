import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-gray-100 py-3 px-4 sm:px-8 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Logo ve Blog Adı */}
<Link href="/" className="flex items-center space-x-3 group">
  <div className="relative w-20 sm:w-24 h-10 sm:h-11 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-gray-100">
    <img
      src="/avatar.jpg"
      alt="Logo"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
    />
  </div>
  <div>
    <span className="font-black text-gray-900 tracking-tight text-base sm:text-lg block leading-tight">
      Warrior's Blog
    </span>
  </div>
</Link>

        {/* Navigasyon Linkleri (Mobilde alt satırda ortalı ve düzenli) */}
        <nav className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
          <Link
            href="/"
            className="px-3.5 py-1 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors"
          >
            Home
          </Link>
          <Link
            href="/categories/journey"
            className="px-3.5 py-1 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors"
          >
            Journey
          </Link>
          <Link
            href="/categories/books"
            className="px-3.5 py-1 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors"
          >
            Books
          </Link>
          <Link
            href="/categories/technology"
            className="px-3.5 py-1 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors"
          >
            Technology
          </Link>
        </nav>

      </div>
    </header>
  );
}