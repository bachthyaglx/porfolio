'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import LoginModal from '../auth/LoginModal';

function NavBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll direction detection (close only when scrolling down)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ignoreScroll = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (menuOpen && !ignoreScroll && currentScrollY > lastScrollY) {
        setMenuOpen(false);
      }

      lastScrollY = currentScrollY;
    };

    if (menuOpen) {
      ignoreScroll = true;
      const timeout = setTimeout(() => {
        ignoreScroll = false;
      }, 300);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  // Token check
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
    window.location.reload();
  };

  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">My Portfolio</div>

        {/* Desktop nav */}
        {!isMobile && (
          <div className="flex gap-6 items-center">
            <Link href="/">Home</Link>
            <Link href="/experience">Experience</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/certificates">Certificates</Link>
            <Link href="/education">Education</Link>
            <Link href="/contact">Contact</Link>
            {!isLoggedIn ? (
              <button
                onClick={() => setShowLogin(true)}
                className="border-2 border-white rounded-3xl px-3 py-1 hover:bg-white hover:text-black transition"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="border-2 border-red-500 rounded-3xl px-3 py-1 hover:bg-red-500 transition"
              >
                Logout
              </button>
            )}
          </div>
        )}

        {/* Mobile toggle button */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Backdrop overlay */}
      {isMobile && menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 right-0 bg-black z-50 transform transition-transform duration-300 ${
            menuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-4 pt-20"> {/* pt-20 to offset top bar */}
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/experience" onClick={() => setMenuOpen(false)}>Experience</Link>
            <Link href="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
            <Link href="/certificates" onClick={() => setMenuOpen(false)}>Certificates</Link>
            <Link href="/education" onClick={() => setMenuOpen(false)}>Education</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            {!isLoggedIn ? (
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
            )}
          </div>
        </div>
      )}

      {/* Login modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
}

export default NavBar;
