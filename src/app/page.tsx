import { redirect } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
  { href: '/dashboard', label: '📋 Dashboard' },
  { href: '/learned', label: '📘 Learned Words' },
];

export default function Home() {
  // Example: Automatically redirect users to '/dashboard' on load.
  redirect('/dashboard');

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-4 hidden sm:block">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">🧠 WordMaster</h2>
        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="block px-4 py-2 rounded-md cursor-pointer font-medium text-gray-700 hover:bg-blue-100 transition">
                {link.label}
              </div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 bg-gray-50">
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-700">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Welcome to WordMaster 🚀</h1>
          <p className="text-lg text-gray-600">Choose an option from the sidebar to get started.</p>
        </div>
      </section>
    </main>
  );
}
