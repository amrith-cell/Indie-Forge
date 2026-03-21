import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../types';

export type AccentColor = {
  name: string;
  value: string;
  twClass: string;
};

export const ACCENT_COLORS: AccentColor[] = [
  { name: 'Emerald', value: '#10b981', twClass: 'emerald' },
  { name: 'Indigo', value: '#6366f1', twClass: 'indigo' },
  { name: 'Rose', value: '#f43f5e', twClass: 'rose' },
  { name: 'Amber', value: '#f59e0b', twClass: 'amber' },
  { name: 'Violet', value: '#8b5cf6', twClass: 'violet' },
  { name: 'Sky', value: '#0ea5e9', twClass: 'sky' },
];

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('accentColor');
    if (saved) {
      const parsed = JSON.parse(saved);
      return ACCENT_COLORS.find(c => c.name === parsed.name) || ACCENT_COLORS[0];
    }
    return ACCENT_COLORS[0];
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--accent', accentColor.value);
    localStorage.setItem('accentColor', JSON.stringify(accentColor));
  }, [accentColor]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setAccentColor = (newColor: AccentColor) => setAccentColorState(newColor);

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
