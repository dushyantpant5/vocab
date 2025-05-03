import Link from 'next/link';

const navLinks = [
    { href: '/dashboard', label: '📋 Dashboard' },
    { href: '/learned', label: '📘 Learned Words' },
    {href: '/signOut', label: '🔓 Logout' }
];

export default function MobileTopBar() {
    return (
        <div className="lg:hidden">
            {/* Mobile Top Bar */}
            <div className="bg-white shadow-md fixed top-0 left-0 w-full z-50 px-4 py-2 flex items-center justify-between">

                <Link href="/">
                    <h2 className="text-xl font-bold text-blue-600 cursor-pointer hover:bg-blue-100 rounded-md transition px-2 py-1">
                        Vocab
                    </h2>
                </Link>

                {/* Navbar Links */}
                <div className="space-x-4">
                    {navLinks.map((link) => (
                         link.label.includes('🔓 Logout')?
                         (
                             <Link key={link.href} href={link.href}>
                             <div className="inline-block mx-4 px-4 py-2 rounded-md cursor-pointer text-sm text-white bg-black hover:bg-gray-800 transition">
                             <button>{link.label}</button>
                             </div>
                             </Link>
                         ):
                         (
                        <Link key={link.href} href={link.href}>
                            <div className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 rounded-md transition">
                                {link.label}
                            </div>
                        </Link>
                         )
                    ))}
                </div>
            </div>
        </div>
    );
}
