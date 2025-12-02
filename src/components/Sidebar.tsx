'use client';

import { useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, Calendar, Clock, CheckSquare, BookOpen, Zap, Settings, Palette } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme, availableThemes } = useTheme();
  const [streak] = useState(1);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themeConfig: Record<string, { 
    bg: string; 
    text: string; 
    hoverBg: string; 
    activeBg: string; 
    streakBg: string; 
    border: string; 
    hover: string;
    button: string;
    buttonHover: string;
  }> = {
    purple: {
      bg: 'bg-purple-50',
      text: 'text-gray-800',
      hoverBg: 'hover:bg-purple-100',
      activeBg: 'bg-purple-700 text-white',
      streakBg: 'bg-purple-100 border border-purple-200',
      border: 'border-purple-100',
      hover: 'hover:text-gray-900',
      button: 'border-purple-200 text-purple-700',
      buttonHover: 'hover:bg-purple-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-gray-800',
      hoverBg: 'hover:bg-blue-100',
      activeBg: 'bg-blue-700 text-white',
      streakBg: 'bg-blue-100 border border-blue-200',
      border: 'border-blue-100',
      hover: 'hover:text-gray-900',
      button: 'border-blue-200 text-blue-700',
      buttonHover: 'hover:bg-blue-100',
    },
    green: {
      bg: 'bg-emerald-50',
      text: 'text-gray-800',
      hoverBg: 'hover:bg-emerald-100',
      activeBg: 'bg-emerald-700 text-white',
      streakBg: 'bg-emerald-100 border border-emerald-200',
      border: 'border-emerald-100',
      hover: 'hover:text-gray-900',
      button: 'border-emerald-200 text-emerald-700',
      buttonHover: 'hover:bg-emerald-100',
    },
    dark: {
      bg: 'bg-slate-50',
      text: 'text-gray-800',
      hoverBg: 'hover:bg-slate-100',
      activeBg: 'bg-slate-700 text-white',
      streakBg: 'bg-slate-100 border border-slate-200',
      border: 'border-slate-100',
      hover: 'hover:text-gray-900',
      button: 'border-slate-200 text-slate-700',
      buttonHover: 'hover:bg-slate-100',
    },
    light: {
      bg: 'bg-amber-50',
      text: 'text-gray-800',
      hoverBg: 'hover:bg-amber-100',
      activeBg: 'bg-amber-700 text-white',
      streakBg: 'bg-amber-100 border border-amber-200',
      border: 'border-amber-100',
      hover: 'hover:text-gray-900',
      button: 'border-amber-200 text-amber-700',
      buttonHover: 'hover:bg-amber-100',
    },
  };

  const config = themeConfig[theme] || themeConfig.purple;

  const themeLabels: Record<string, string> = {
    purple: '🟣 Purple',
    blue: '🔵 Blue',
    green: '🟢 Green',
    dark: '🌙 Dark',
    light: '☀️ Light',
  };

  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard', badge: null },
    { icon: Calendar, label: 'Calendar', href: '/calendar', badge: null },
    { icon: Clock, label: 'Focus Timer', href: '/focus-timer', badge: null },
    { icon: CheckSquare, label: 'Tasks', href: '/', badge: null },
    { icon: BookOpen, label: 'Notes', href: '/notes', badge: null },
    { icon: Zap, label: 'Motivation', href: '/motivation', badge: null },
    { icon: Settings, label: 'Settings', href: '/settings', badge: null },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className={`w-full sm:w-80 ${config.bg} backdrop-blur border-r ${config.border} p-6 space-y-6 min-h-screen`}>
      {/* Current Streak */}
      <div className={`${config.streakBg} rounded-lg p-4 text-gray-800`}>
        <div className="text-center">
          <div className="text-sm font-semibold mb-2">Current Streak</div>
          <div className="text-4xl font-bold mb-3">{streak}</div>
          <div className="flex justify-around mb-3">
            <button className="text-xs font-bold hover:opacity-80 transition-opacity">Check-in</button>
            <button className="text-xs font-bold hover:opacity-80 transition-opacity">Reset</button>
          </div>
          <div className="text-xs">Last: 2025-10-28</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? `${config.activeBg} text-white`
                  : `${config.text} ${config.hoverBg} ${config.hover}`
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Section */}
      <div className={`border-t ${config.border} pt-6`}>
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${config.button} font-bold ${config.buttonHover} transition-colors`}
          >
            <Palette className="w-5 h-5" />
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </button>

          {showThemeMenu && (
            <div className={`absolute bottom-full left-0 right-0 mb-2 ${theme === 'light' ? 'bg-gray-200' : 'bg-' + theme + '-800'} rounded-lg shadow-lg border ${config.border} overflow-hidden z-50`}>
              <div className="p-2 space-y-1">
                {(availableThemes as string[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      toggleTheme(t as any);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm rounded transition-colors ${
                      theme === t
                        ? `${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-yellow-400 text-purple-900'} font-bold`
                        : `${config.text} ${config.hoverBg}`
                    }`}
                  >
                    {themeLabels[t]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={`text-xs ${config.text} text-center mt-3`}>
          Sync: Local <span className={theme === 'light' ? 'text-blue-600' : 'text-yellow-400'}>v2.0</span>
        </div>
      </div>
    </aside>
  );
};
