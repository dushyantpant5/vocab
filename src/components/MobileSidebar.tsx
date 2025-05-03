"use client";
import Link from "next/link";
import { useState } from "react";
const navLinks = [
  { href: "/dashboard", label: "📋 Dashboard" },
  { href: "/learned", label: "📘 Learned Words" },
  { href: "/signOut", label: "🔓 Logout" },
];

export default function MobileTopBar() {
  const [menuOpen, setMenuOpen] = useState(false); // state to track menu open/close
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="lg:hidden">
      {/* Mobile Top Bar */}
      <div className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg fixed top-0 left-0 w-full z-50 px-4 py-2 flex flex-row items-center">
        <div className="basis-1/2">
          <Link href="/">
            <h2 className="text-3xl font-bold text-blue-600 cursor-pointer hover:bg-blue-100 rounded-md transition px-2 py-1 ">
              Vocab
            </h2>
          </Link>
        </div>
        <div className="flex flex-col justify-items-end basis-1/2">
          {menuOpen ? (
            navLinks.map((link) =>
              link.label.includes("🔓 Logout") ? (
                <Link key={link.href} href={link.href}>
                  <div className="inline-block mx-4 px-4 py-2 rounded-md cursor-pointer text-sm text-white bg-black hover:bg-gray-800 transition ">
                    <button>{link.label}</button>
                  </div>
                </Link>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label.includes("📋 Dashboard") ? (
                    <>
                      <div className="mx-18">
                        <button
                          onClick={toggleMenu}
                          className="text-3xl font-bold text-black"
                        >
                          &times;
                        </button>
                      </div>
                      <div className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 rounded-md transition">
                        {link.label}
                      </div>
                    </>
                  ) : (
                    <div className="inline-block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 rounded-md transition">
                      {link.label}
                    </div>
                  )}
                </Link>
              )
            )
          ) : (
            <button
              onClick={toggleMenu}
              className=" mx-10 text-3xl text-black "
            >
              &#9776;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
