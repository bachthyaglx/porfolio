'use client'

import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-end gap-8 shadow-md sticky top-0 z-50">
      <Link href="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
