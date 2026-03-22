import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import DeveloperDashboard from './components/DeveloperDashboard';
import Support from './components/Support';
import Settings from './components/Settings';
import Library from './components/Library';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';

import GameDetails from './components/GameDetails';

function AppContent() {
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<'store' | 'dashboard' | 'support' | 'settings' | 'library' | 'game'>('store');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen text-neutral-900 dark:text-neutral-50 selection:bg-(--accent)/30">
      <Navbar 
        theme={theme} 
        setTheme={setTheme} 
        view={view as any}
        setView={setView as any}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <main>
        <AnimatePresence mode="wait">
          {view === 'store' ? (
            <motion.div
              key="store"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Storefront onGameSelect={(id: string) => { setSelectedGameId(id); setView('game'); }} />
            </motion.div>
          ) : view === 'game' ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <GameDetails 
                gameId={selectedGameId} 
                onBack={() => { setView('store'); setSelectedGameId(null); }} 
              />
            </motion.div>
          ) : view === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <DeveloperDashboard setView={setView as any} />
            </motion.div>
          ) : view === 'support' ? (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Support />
            </motion.div>
          ) : view === 'library' ? (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Library />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 px-6 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg" />
            <span className="font-display font-bold text-lg">IndieForge</span>
          </div>
          <p className="text-sm text-neutral-500">
            © 2026 IndieForge. Built for the next generation of game developers.
          </p>
          <div className="flex gap-6 text-sm font-medium text-neutral-500">
            <button onClick={() => setView('settings')} className="hover:text-accent transition-colors">Settings</button>
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <button onClick={() => setView('support')} className="hover:text-accent transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
