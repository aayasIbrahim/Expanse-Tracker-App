"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Add Expense", href: "/add" },
    { name: "Report", href: "/report" },
    { name: "Employee", href: "/clients" },
    { name: "Transactions", href: "/transactions" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md relative z-50 sticky top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <h1
            className="
    text-xl sm:text-2xl lg:text-3xl 
    font-bold 
    text-green-400 
    cursor-pointer 
    flex items-center gap-2 
    whitespace-nowrap 
    select-none
  "
          >
            <span role="img" aria-label="money">
              💰
            </span>
            <span className="truncate">Expense Tracker</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center gap-8 text-gray-300 font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-green-400 transition ${
                pathname === link.href ? "text-green-400 font-semibold" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Login + Hamburger */}
        <div className="flex items-center gap-3">
          {/* Login button desktop */}
          <button
            onClick={() => router.push("/login")}
            className="hidden md:block bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded text-white font-medium transition"
          >
            Login
          </button>
          {/* Login button mobile */}
          <button
            onClick={() => {
              router.push("/login");
              setIsMenuOpen(false);
            }}
            className="w-full px-4 py-2 mt-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium lg:hidden "
          >
            Login
          </button>
          {/* Hamburger menu mobile */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <RxCross1 /> : <AiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-4 flex flex-col gap-2 border-t border-green-600">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-gray-300 hover:text-green-400 transition ${
                pathname === link.href ? "text-green-400 font-semibold" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
