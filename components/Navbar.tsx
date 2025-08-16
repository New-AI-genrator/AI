"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiMenu, FiMoon, FiSearch, FiSun, FiX } from 'react-icons/fi';

export default function Navbar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try { localStorage.setItem('theme', next); } catch { }
      return next;
    });
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm' : 'bg-white dark:bg-gray-900'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Tools Directory</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Home</Link>
            <div className="relative group">
              <button className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 flex items-center">
                Categories
                <svg className="ml-1 w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Mega Menu */}
              <div className="absolute top-full left-0 mt-2 w-screen max-w-6xl transform -translate-x-1/2 left-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-6 grid grid-cols-4 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Productivity & Business</h3>
                    <ul className="space-y-2">
                      <li><Link href="/ai-tools/productivity" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Productivity</Link></li>
                      <li><Link href="/ai-tools/marketing" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Marketing</Link></li>
                      <li><Link href="/ai-tools/sales" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Sales</Link></li>
                      <li><Link href="/ai-tools/finance" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Finance</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Creative & Design</h3>
                    <ul className="space-y-2">
                      <li><Link href="/ai-tools/design" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Design</Link></li>
                      <li><Link href="/ai-tools/writing" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Writing</Link></li>
                      <li><Link href="/ai-tools/video" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Video</Link></li>
                      <li><Link href="/ai-tools/audio" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Audio</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Development & Tech</h3>
                    <ul className="space-y-2">
                      <li><Link href="/ai-tools/coding" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Coding</Link></li>
                      <li><Link href="/ai-tools/data" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Data Science</Link></li>
                      <li><Link href="/ai-tools/cybersecurity" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Cybersecurity</Link></li>
                      <li><Link href="/ai-tools/automation" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Automation</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Specialized</h3>
                    <ul className="space-y-2">
                      <li><Link href="/ai-tools/healthcare" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Healthcare</Link></li>
                      <li><Link href="/ai-tools/education" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Education</Link></li>
                      <li><Link href="/ai-tools/legal" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Legal</Link></li>
                      <li><Link href="/ai-tools/real-estate" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Real Estate</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/new-tools" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">New Tools</Link>
            <Link href="/compare" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Compare</Link>
            <Link href="/favorites" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Favorites</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Blog</Link>
            <Link href="/api-docs" className="group inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              API Docs
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors">New</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search AI tools..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center space-x-2">
              <Link href="/suggest-tool" className="px-3 py-1.5 text-sm rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors">Suggest a Tool</Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-200 ${isMenuOpen ? 'max-h-96 border-t border-gray-200 dark:border-gray-800' : 'max-h-0'}`}>
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900">
          {/* Mobile Search */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search AI tools..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <Link href="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Home</Link>
          <Link href="/ai-tools" onClick={closeMenu} className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Categories</Link>
          <Link href="/new-tools" onClick={closeMenu} className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">New Tools</Link>
          <Link href="/compare" onClick={closeMenu} className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Compare</Link>
          <Link href="/favorites" onClick={closeMenu} className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Favorites</Link>
          <Link href="/blog" onClick={closeMenu} className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Blog</Link>
          <Link href="/api-docs" onClick={closeMenu} className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">API Docs</Link>
          <Link href="/suggest-tool" onClick={closeMenu} className="block px-3 py-2 rounded-md text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Suggest a Tool</Link>


        </div>
      </div>
    </header>
  );
}
