'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import LoginModal from '../auth/LoginModal';

function NavBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ignoreScrollRef = useRef(false); // avoid re-renders on scroll
  const lastScrollYRef = useRef(0);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem('app-user-token');
    setIsLoggedIn(!!token);
  }, []);

  // Scroll direction detection (close only when scrolling down)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (menuOpen && !ignoreScrollRef.current && currentScrollY > lastScrollYRef.current) {
        setMenuOpen(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    if (menuOpen) {
      ignoreScrollRef.current = true;
      const timeout = setTimeout(() => {
        ignoreScrollRef.current = false;
      }, 300);

      return () => clearTimeout(timeout);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('app-user-token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const menuItems = (
    <>
      <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
      <Link href="/experience" onClick={() => setMenuOpen(false)}>Experience</Link>
      <Link href="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
      <Link href="/certificates" onClick={() => setMenuOpen(false)}>Certificates</Link>
      <Link href="/education" onClick={() => setMenuOpen(false)}>Education</Link>
      <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
    </>
  );

  const authButton = !isLoggedIn ? (
    <button
      onClick={() => {
        setShowLogin(true);
        setMenuOpen(false);
      }}
      className="border-2 border-white rounded-3xl px-3 py-1 hover:bg-white hover:text-black transition"
    >
      Login
    </button>
  ) : (
    <button
      onClick={() => {
        handleLogout();
        setMenuOpen(false);
      }}
      className="border-2 border-red-500 rounded-3xl px-3 py-1 hover:bg-red-500 transition"
    >
      Logout
    </button>
  );

  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">MyPortfolio</div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {menuItems}
          {authButton}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden bg-black px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen
            ? 'max-h-[500px] opacity-100 visible pointer-events-auto'
            : 'max-h-0 opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 py-4">
          {menuItems}
          {authButton}
        </div>
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
