import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, MessageSquare, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">A</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AdoAI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={Home} isActive={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/chat" icon={MessageSquare} isActive={location.pathname === '/chat'}>
              Chat
            </NavLink>
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-1">
              <NavLink to="/" icon={Home} isActive={location.pathname === '/'} />
              <NavLink to="/chat" icon={MessageSquare} isActive={location.pathname === '/chat'} />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const NavLink = ({ to, icon: Icon, isActive, children }) => {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Icon className="w-4 h-4" />
        {children && <span className="hidden md:block">{children}</span>}
      </motion.div>
    </Link>
  );
};

export default Header;