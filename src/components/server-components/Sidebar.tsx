// components/Sidebar.tsx (for Desktop Only)
import Link from 'next/link';

const navLinks = [
    { href: '/dashboard', label: '📋 Dashboard' },
    { href: '/learned', label: '📘 Learned Words' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-4 hidden lg:block">
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
    );
}
