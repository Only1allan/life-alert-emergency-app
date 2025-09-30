'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

interface NavbarProps {
  user?: {
    name: string;
    isLoggedIn: boolean;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const publicNavItems: NavItem[] = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'About', href: '#about', icon: 'ℹ️' },
    { name: 'Why Us', href: '#why-us', icon: '⭐' },
    { name: 'Contact Us', href: '#contact', icon: '📞' },
  ];

  const privateNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Emergency Log', href: '/emergency-log', icon: '📋' },
  ];

  const navItems = user?.isLoggedIn ? privateNavItems : publicNavItems;

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src="/images/LifeGuardPro_Logo_Transparent.png"
              alt="LifeGuard Pro Logo"
              width={120}
              height={120}
              className="object-contain"
            />
            
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActivePath(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-white hover:text-blue-200 hover:bg-white/10'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* User Menu */}
            {user?.isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm text-white">Hi, {user.name.split(' ')[0]}</span>
                </div>
                <button className="text-red-200 hover:text-red-100 text-sm font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 text-white hover:text-blue-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/80 backdrop-blur-sm border-t border-white/20 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActivePath(item.href)
                      ? 'bg-white/20 text-white'
                      : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {user?.isLoggedIn ? (
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-white">{user.name}</span>
                  </div>
                  <button className="w-full text-left px-3 py-2 text-red-200 hover:text-red-100 text-sm font-medium">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Emergency Banner (shown when emergency is active) */}
      {user?.isLoggedIn && (
        <div className="bg-green-100 border-b border-green-200 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Emergency System Active</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}