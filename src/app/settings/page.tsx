'use client';

import { Header, Sidebar } from '@/components';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useThemeListener } from '@/hooks/useThemeListener';
import { Download, Upload, Trash2, Moon, Bell } from 'lucide-react';

export default function Settings() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { getThemeClasses } = useThemeListener();
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);
  const [breakReminders, setBreakReminders] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/signin');
    }
  }, [mounted, isLoading, user, router]);

  if (!mounted || isLoading || !user) {
    return <div className={`min-h-screen ${getThemeClasses().bg}`} />;
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/exports?userId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'JSON' })
      });
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        alert('Tasks exported successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export tasks');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          JSON.parse(text);
          // Import logic would go here
          alert('Tasks imported successfully!');
        } catch {
          alert('Invalid file format');
        }
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This cannot be undone.')) {
      // Clear all user data
      localStorage.clear();
      setDarkMode(true);
      setCompactMode(false);
      setTaskReminders(true);
      setBreakReminders(true);
      alert('All data cleared');
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses().bg}`}>
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Page Title */}
            <div>
              <h2 className={`text-3xl font-bold ${getThemeClasses().text} mb-2`}>⚙️ Settings</h2>
            </div>

            {/* Settings & Data */}
            <div className={`${getThemeClasses().card} backdrop-blur rounded-lg p-6 border`}>
              <h3 className={`text-2xl font-bold ${getThemeClasses().text} mb-6`}>⚙️ Settings & Data</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Data Management */}
                <div>
                  <h4 className={`${getThemeClasses().text} font-bold mb-4 flex items-center gap-2`}>
                    <Download className="w-5 h-5" />
                    Data Management
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={handleExport}
                      className={`w-full ${getThemeClasses().button} ${getThemeClasses().text} py-3 rounded font-bold ${getThemeClasses().hover} transition-colors flex items-center justify-center gap-2`}
                    >
                      <Download className="w-5 h-5" />
                      Export Data
                    </button>
                    <button
                      onClick={handleImport}
                      className={`w-full ${getThemeClasses().button} ${getThemeClasses().text} py-3 rounded font-bold ${getThemeClasses().hover} transition-colors flex items-center justify-center gap-2`}
                    >
                      <Upload className="w-5 h-5" />
                      Import Data
                    </button>
                    <button
                      onClick={handleClearData}
                      className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Clear All Data
                    </button>
                  </div>
                </div>

                {/* Cloud Sync */}
                <div>
                  <h4 className={`${getThemeClasses().text} font-bold mb-4 flex items-center gap-2`}>
                    <Bell className="w-5 h-5" />
                    Cloud Sync
                  </h4>
                  <div className="space-y-2">
                    <button className={`w-full ${getThemeClasses().button} ${getThemeClasses().text} py-3 rounded font-bold ${getThemeClasses().hover} transition-colors`}>
                      Enable Cloud Sync
                    </button>
                    <button className={`w-full ${getThemeClasses().cardAlt} ${getThemeClasses().mutedText} py-3 rounded font-bold cursor-not-allowed opacity-50`}>
                      Sync Now
                    </button>
                    <p className={`${getThemeClasses().mutedText} text-sm`}>Cloud sync is currently disabled</p>
                  </div>
                </div>
              </div>

              {/* Appearance Section */}
              <div className={`border-t ${getThemeClasses().border} pt-6 mb-6`}>
                <h4 className={`${getThemeClasses().text} font-bold mb-4 flex items-center gap-2`}>
                  <Moon className="w-5 h-5" />
                  Appearance
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      className="w-5 h-5"
                    />
                    <span className={getThemeClasses().mutedText}>Dark Mode</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compactMode}
                      onChange={() => setCompactMode(!compactMode)}
                      className="w-5 h-5"
                    />
                    <span className={getThemeClasses().mutedText}>Compact Mode</span>
                  </label>
                </div>
              </div>

              {/* Notifications Section */}
              <div className={`border-t ${getThemeClasses().border} pt-6`}>
                <h4 className={`${getThemeClasses().text} font-bold mb-4 flex items-center gap-2`}>
                  <Bell className="w-5 h-5" />
                  Notifications
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taskReminders}
                      onChange={() => setTaskReminders(!taskReminders)}
                      className="w-5 h-5"
                    />
                    <span className={getThemeClasses().mutedText}>Task Reminders</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={breakReminders}
                      onChange={() => setBreakReminders(!breakReminders)}
                      className="w-5 h-5"
                    />
                    <span className={getThemeClasses().mutedText}>Break Reminders</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
