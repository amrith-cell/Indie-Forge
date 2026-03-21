import React from 'react';
import { motion } from 'motion/react';
import { useTheme, ACCENT_COLORS } from '../contexts/ThemeContext';
import { Moon, Sun, Palette, Check, Shield, Bell, User } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-display font-black mb-2 tracking-tight">Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Personalize your IndieForge experience and manage your account.
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Appearance Section */}
        <section className="glass p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center text-accent">
              <Palette size={20} />
            </div>
            <h2 className="text-xl font-bold">Appearance</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Theme Toggle */}
            <div>
              <label className="block text-sm font-semibold mb-4 text-neutral-500 uppercase tracking-wider">
                Color Mode
              </label>
              <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl w-fit">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    theme === 'light' 
                      ? 'bg-white text-neutral-900 shadow-sm' 
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Sun size={18} />
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    theme === 'dark' 
                      ? 'bg-neutral-700 text-white shadow-sm' 
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Moon size={18} />
                  Dark
                </button>
              </div>
            </div>

            {/* Accent Color Picker */}
            <div>
              <label className="block text-sm font-semibold mb-4 text-neutral-500 uppercase tracking-wider">
                Accent Color
              </label>
              <div className="flex flex-wrap gap-3">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setAccentColor(color)}
                    className="group relative w-10 h-10 rounded-full transition-transform active:scale-90"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {accentColor.name === color.name && (
                      <motion.div
                        layoutId="activeAccent"
                        className="absolute inset-0 flex items-center justify-center text-white"
                      >
                        <Check size={20} strokeWidth={3} />
                      </motion.div>
                    )}
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/50 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Account Section (Mock) */}
        <section className="glass p-8 rounded-3xl opacity-60">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold">Account Details</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <p className="font-bold">Username</p>
                <p className="text-sm text-neutral-500">amrith185</p>
              </div>
              <button className="text-sm font-bold text-accent">Edit</button>
            </div>
            <div className="flex justify-between items-center py-4">
              <div>
                <p className="font-bold">Email Address</p>
                <p className="text-sm text-neutral-500">amrith185@gmail.com</p>
              </div>
              <button className="text-sm font-bold text-accent">Change</button>
            </div>
          </div>
        </section>

        {/* Security Section (Mock) */}
        <section className="glass p-8 rounded-3xl opacity-60">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-bold">Security</h2>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Two-Factor Authentication</p>
              <p className="text-sm text-neutral-500">Add an extra layer of security to your account.</p>
            </div>
            <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full relative cursor-not-allowed">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
