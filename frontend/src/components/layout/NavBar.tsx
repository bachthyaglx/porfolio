// src/components/layout/NavBar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoginModal from '../auth/LoginModal';

function NavBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('app-user-token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('app-user-token');
    setIsLoggedIn(false);
    window.location.reload(); // Or use router to redirect
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Left section */}
      <div className="flex gap-8">
        <Link href="/">Home</Link>
        <Link href="/experience">Experience</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/certificates">Certificates</Link>
        <Link href="/education">Education</Link>
        <Link href="/contact">Contact</Link>
      </div>

      {/* Right section: Login / Logout */}
      <div>
        {!isLoggedIn ? (
          <button
            onClick={() => setShowLogin(true)}
            className="transition ease-in-out duration-300 text-center border-2 border-white rounded-3xl px-3 py-1 hover:bg-white hover:text-black"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="transition ease-in-out duration-300 text-center border-2 border-red-500 text-white rounded-3xl px-3 py-1 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
}

export default NavBar;
