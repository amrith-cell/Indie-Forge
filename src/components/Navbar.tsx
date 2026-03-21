import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, User, Moon, Sun, LayoutDashboard, ShoppingBag, HelpCircle, Settings as SettingsIcon, Library as LibraryIcon } from 'lucide-react';
import { Theme } from '../types';

interface NavbarProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  role: 'gamer' | 'developer';
  setRole: (role: 'gamer' | 'developer') => void;
  view: 'store' | 'dashboard' | 'support' | 'settings' | 'library';
  setView: (view: 'store' | 'dashboard' | 'support' | 'settings' | 'library') => void;
}

export default function Navbar({ theme, setTheme, role, setRole, view, setView }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('store')}>
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
            <Gamepad2 size={24} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">IndieForge</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => setView('store')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'store' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} />
                Store
              </div>
            </button>
            {role === 'developer' && (
              <button
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'dashboard' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </div>
              </button>
            )}
            {role === 'gamer' && (
              <button
                onClick={() => setView('library')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'library' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LibraryIcon size={16} />
                  Library
                </div>
              </button>
            )}
            <button
              onClick={() => setView('support')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'support' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <HelpCircle size={16} />
                Support
              </div>
            </button>
            <button
              onClick={() => setView('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'settings' ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <SettingsIcon size={16} />
                Settings
              </div>
            </button>
          </div>

          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative overflow-hidden"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: 20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
            
            <button
              onClick={() => setRole(role === 'gamer' ? 'developer' : 'gamer')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:scale-105 transition-transform"
            >
              <User size={16} />
              {role === 'gamer' ? 'Gamer' : 'Dev'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
