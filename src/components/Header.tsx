'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useTheme } from '@/context/ThemeContext';

export const Header = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme, availableThemes } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<string>('');

  useEffect(() => {
    // Set current date and day
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    setCurrentDay(days[today.getDay()]);
    setCurrentDate(today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
  }, []);

  const themeConfig: Record<string, { 
    headerBg: string; 
    border: string; 
    text: string; 
    accent: string;
    hoverBg: string;
    menuBg: string;
  }> = {
    purple: {
      headerBg: 'bg-white/80 backdrop-blur',
      border: 'border-purple-100',
      text: 'text-gray-700',
      accent: 'text-purple-600',
      hoverBg: 'hover:bg-purple-50',
      menuBg: 'bg-white',
    },
    blue: {
      headerBg: 'bg-white/80 backdrop-blur',
      border: 'border-blue-100',
      text: 'text-gray-700',
      accent: 'text-blue-600',
      hoverBg: 'hover:bg-blue-50',
      menuBg: 'bg-white',
    },
    green: {
      headerBg: 'bg-white/80 backdrop-blur',
      border: 'border-emerald-100',
      text: 'text-gray-700',
      accent: 'text-emerald-600',
      hoverBg: 'hover:bg-emerald-50',
      menuBg: 'bg-white',
    },
    dark: {
      headerBg: 'bg-white/80 backdrop-blur',
      border: 'border-slate-200',
      text: 'text-gray-700',
      accent: 'text-slate-600',
      hoverBg: 'hover:bg-slate-100',
      menuBg: 'bg-white',
    },
    light: {
      headerBg: 'bg-white/80 backdrop-blur',
      border: 'border-amber-100',
      text: 'text-gray-700',
      accent: 'text-amber-600',
      hoverBg: 'hover:bg-amber-100',
      menuBg: 'bg-white',
    },
  };

  const config = themeConfig[theme] || themeConfig.purple;

  const handleLogout = () => {
    signOut();
    router.push('/signin');
  };

  const goToAdmin = () => {
    router.push('/admin');
  };

  const themeLabels: Record<string, string> = {
    purple: '🟣 Purple',
    blue: '🔵 Blue',
    green: '🟢 Green',
    dark: '🌙 Dark',
    light: '☀️ Light',
  };

  return (
    <header className={`sticky top-0 z-50 ${config.headerBg} backdrop-blur border-b ${config.border} shadow-lg`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Task-Tackler</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Date Info */}
            <div className="text-right">
              <div className={`${config.accent} font-bold`}>Today • {currentDay}</div>
              <div className={`text-sm ${config.text}`}>{currentDate}</div>
            </div>

            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={`p-2 rounded-lg ${config.hoverBg} transition-colors ${config.accent}`}
                title="Change theme"
              >
                <Palette className="w-5 h-5" />
              </button>

              {showThemeMenu && (
                <div className={`absolute right-0 mt-2 w-48 ${config.menuBg} rounded-lg shadow-lg border ${config.border} overflow-hidden z-50`}>
                  <div className="p-2 space-y-1">
                    {availableThemes.map((t: string) => (
                      <button
                        key={t}
                        onClick={() => {
                          toggleTheme(t as any);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm rounded transition-colors ${
                          theme === t
                            ? `bg-blue-600 text-white font-bold`
                            : `text-gray-700 hover:bg-gray-100`
                        }`}
                      >
                        {themeLabels[t]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-2 rounded-lg ${config.hoverBg} transition-colors`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
              </button>

              {showMenu && (
                <div className={`absolute right-0 mt-2 w-48 ${config.menuBg} rounded-lg shadow-lg border ${config.border} overflow-hidden z-50`}>
                  {user?.role === 'admin' && (
                    <>
                      <button
                        onClick={() => {
                          goToAdmin();
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors`}
                      >
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                      <div className={`border-t ${config.border}`} />
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
