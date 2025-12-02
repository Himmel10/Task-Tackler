'use client';

import { useState, useEffect } from 'react';

export const useThemeListener = () => {
  const [theme, setTheme] = useState('purple');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get initial theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('task-tackler-theme');
      if (savedTheme && ['purple', 'blue', 'green', 'dark', 'light'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
      // Listen for theme changes
      const handleThemeChange = (e: any) => {
        if (e.detail?.theme) {
          setTheme(e.detail.theme);
        }
      };
      window.addEventListener('themeChange', handleThemeChange);
      return () => window.removeEventListener('themeChange', handleThemeChange);
    }
  }, []);

  const getThemeClasses = () => {
    const themes: Record<string, { bg: string; card: string; cardAlt: string; input: string; button: string; text: string; accent: string; border: string; hover: string; mutedText: string; dimText: string; selectBg: string }> = {
      purple: {
        bg: 'bg-white',
        card: 'bg-purple-50 border border-purple-100 shadow-sm',
        cardAlt: 'bg-white border border-purple-50',
        input: 'bg-white border border-purple-200 text-gray-900 placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-300/50',
        selectBg: 'bg-white text-gray-900 border border-purple-200',
        button: 'bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 shadow-lg hover:shadow-xl transition-all',
        text: 'text-gray-800',
        accent: 'text-purple-600',
        border: 'border-purple-100',
        hover: 'hover:bg-purple-100/40',
        mutedText: 'text-gray-600',
        dimText: 'text-gray-500',
      },
      blue: {
        bg: 'bg-white',
        card: 'bg-blue-50 border border-blue-100 shadow-sm',
        cardAlt: 'bg-white border border-blue-50',
        input: 'bg-white border border-blue-200 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/50',
        selectBg: 'bg-white text-gray-900 border border-blue-200',
        button: 'bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 shadow-lg hover:shadow-xl transition-all',
        text: 'text-gray-800',
        accent: 'text-blue-600',
        border: 'border-blue-100',
        hover: 'hover:bg-blue-100/40',
        mutedText: 'text-gray-600',
        dimText: 'text-gray-500',
      },
      green: {
        bg: 'bg-white',
        card: 'bg-emerald-50 border border-emerald-100 shadow-sm',
        cardAlt: 'bg-white border border-emerald-50',
        input: 'bg-white border border-emerald-200 text-gray-900 placeholder-gray-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50',
        selectBg: 'bg-white text-gray-900 border border-emerald-200',
        button: 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 shadow-lg hover:shadow-xl transition-all',
        text: 'text-gray-800',
        accent: 'text-emerald-600',
        border: 'border-emerald-100',
        hover: 'hover:bg-emerald-100/40',
        mutedText: 'text-gray-600',
        dimText: 'text-gray-500',
      },
      dark: {
        bg: 'bg-white',
        card: 'bg-slate-50 border border-slate-100 shadow-sm',
        cardAlt: 'bg-white border border-slate-50',
        input: 'bg-white border border-slate-200 text-gray-900 placeholder-gray-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300/50',
        selectBg: 'bg-white text-gray-900 border border-slate-200',
        button: 'bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 shadow-lg hover:shadow-xl transition-all',
        text: 'text-gray-800',
        accent: 'text-slate-600',
        border: 'border-slate-100',
        hover: 'hover:bg-slate-100/40',
        mutedText: 'text-gray-600',
        dimText: 'text-gray-500',
      },
      light: {
        bg: 'bg-white',
        card: 'bg-amber-50 border border-amber-100 shadow-sm',
        cardAlt: 'bg-white border border-amber-50',
        input: 'bg-white border border-amber-200 text-gray-900 placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/50',
        selectBg: 'bg-white text-gray-900 border border-amber-200',
        button: 'bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 shadow-lg hover:shadow-xl transition-all',
        text: 'text-gray-800',
        accent: 'text-amber-600',
        border: 'border-amber-100',
        hover: 'hover:bg-amber-100/40',
        mutedText: 'text-gray-600',
        dimText: 'text-gray-500',
      },
    };
    return themes[theme] || themes.purple;
  };

  return { theme, mounted, getThemeClasses, getThemeBackground: () => getThemeClasses().bg };
};
