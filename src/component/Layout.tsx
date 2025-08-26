import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Music, User, Plus, Menu, X } from 'lucide-react';
import WalletConnect from './WalletConnect';

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/blogs', icon: FileText, label: 'Blogs' },
    { path: '/music', icon: Music, label: 'Music' },
    { path: '/create', icon: Plus, label: 'Create' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-black w-screen">
      {/* Top Header */}
      <header className="bg-black text-white shadow-md w-full">
        <div className="flex items-center justify-between px-4 py-3">
          {/* App Name */}
          <Link to="/" className="text-xl font-bold text-blue-400">
            ContentVerse
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  location.pathname === path
                    ? 'text-blue-400 font-semibold'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* WalletConnect */}
          <div className="hidden md:block">
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black border-t border-gray-700 px-4 py-2 space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 py-2 text-sm ${
                  location.pathname === path
                    ? 'text-blue-400 font-semibold'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-700">
              <WalletConnect />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
