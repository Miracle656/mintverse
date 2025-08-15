import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Music, User, Plus } from 'lucide-react';
import WalletConnect from './WalletConnect';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/blogs', icon: FileText, label: 'Blogs' },
    { path: '/music', icon: Music, label: 'Music' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              ContentVerse
            </Link>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  location.pathname === path
                    ? 'border-black text-black font-medium'
                    : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}