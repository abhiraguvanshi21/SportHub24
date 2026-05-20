import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'News', path: '/news' },
    { name: 'Live Scoring', path: '/live-scoring' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 backdrop-blur-lg border-b border-red-100 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* 🔥 Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-lg">🏏</span>
            </motion.div>

            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent tracking-wide"
            >
              CRICSEM
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }}>
                <Link
                  to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  {item.name}

                  {/* Animated underline */}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 bottom-0 w-full h-[2px] bg-red-600"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/add-match"
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl font-medium shadow hover:shadow-lg transition"
                  >
                    <Plus className="inline h-4 w-4 mr-1" />
                    Add Match
                  </Link>
                </motion.div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 transition"
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2"
                      >
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 hover:bg-red-50"
                        >
                          My Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-red-600">
                  Login
                </Link>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl shadow"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-red-50 rounded-lg"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;