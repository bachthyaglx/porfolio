'use client';

import Link from "next/link";

function NavBar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      
      {/* Left section */}
      <div className="flex gap-8">
        <Link href="/">Home</Link>
        <Link href="/experience">Experience</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/contact">Contact</Link>
      </div>

      {/* Right section */}
      <div>
        <Link href="/login" className="transition ease-in-out duration-300 text-center border-2 border-white rounded-3xl px-3 py-1 hover:bg-white hover:text-black">Login</Link>
      </div>

    </nav>
  );
}

export default NavBar;
