import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, LogIn } from 'lucide-react';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50 header-glass border-b border-slate-700/30"
    >
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              className="relative w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-5 h-5 text-white relative z-10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-500 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.span 
              className="text-xl font-bold text-white"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              AgentVC
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {['Features', 'Resources', 'Pricing'].map((item, index) => (
              <motion.a
                key={item}
                href={item === 'Features' ? '#features' : `/${item.toLowerCase()}`}
                className="text-slate-300 hover:text-white transition-all duration-300 font-medium relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -1 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => onOpenAuth('signup')}
              className="text-slate-300 hover:text-white transition-all duration-300 font-medium relative group"
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              Join Waitlist
              <motion.div
                className="absolute inset-0 bg-slate-800/30 rounded-lg opacity-0 -z-10"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenAuth('login')}
              className="btn-primary micro-bounce relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10 flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;