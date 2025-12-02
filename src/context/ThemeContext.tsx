'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'purple' | 'blue' | 'green';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (newTheme?: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors: Record<Theme, { bg: string; text: string; accent: string; secondary: string }> = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-800',
    accent: 'bg-amber-700',
    secondary: 'bg-amber-100',
  },
  dark: {
    bg: 'bg-white',
    text: 'text-gray-800',
    accent: 'bg-slate-700',
    secondary: 'bg-white/60',
  },
  purple: {
    bg: 'bg-white',
    text: 'text-gray-800',
    accent: 'bg-purple-700',
    secondary: 'bg-white/60',
  },
  blue: {
    bg: 'bg-white',
    text: 'text-gray-800',
    accent: 'bg-blue-700',
    secondary: 'bg-white/60',
  },
  green: {
    bg: 'bg-white',
    text: 'text-gray-800',
    accent: 'bg-emerald-700',
    secondary: 'bg-white/60',
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('purple');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('task-tackler-theme') as Theme | null;
      if (savedTheme && (Object.keys(themeColors) as Theme[]).includes(savedTheme)) {
        setTheme(savedTheme);
      } else {
        setTheme('purple');
      }
      setMounted(true);
    }
  }, []);

  const toggleTheme = (newTheme?: Theme) => {
    let nextTheme: Theme;

    if (newTheme) {
      nextTheme = newTheme;
    } else {
      const themes: Theme[] = ['purple', 'blue', 'green', 'dark', 'light'];
      const currentIndex = themes.indexOf(theme);
      nextTheme = themes[(currentIndex + 1) % themes.length];
    }

    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('task-tackler-theme', nextTheme);
      console.log('Theme changed to:', nextTheme);
      // Dispatch custom event for theme change
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: nextTheme } }));
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, availableThemes: Object.keys(themeColors) as Theme[] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const getThemeColors = (theme: Theme) => {
  return themeColors[theme];
};

export { themeColors };
