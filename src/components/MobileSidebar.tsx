import Link from 'next/link';

const navLinks = [
    { href: '/dashboard', label: '📋 Dashboard' },
    { href: '/learned', label: '📘 Learned Words' },
];

export default function MobileTopBar() {
    return (
        <div className="lg:hidden">
            {/* Mobile Top Bar */}
            <div className="bg-white shadow-md fixed top-0 left-0 w-full z-50 px-4 py-2 flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-600">🧠 WordMaster</h2>

                {/* Navbar Links */}
                <div className="space-x-4">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <div className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 rounded-md transition">
                                {link.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
