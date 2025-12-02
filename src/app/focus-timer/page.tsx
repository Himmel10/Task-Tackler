'use client';

import { Header, Sidebar } from '@/components';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useThemeListener } from '@/hooks/useThemeListener';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function FocusTimer() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { getThemeClasses } = useThemeListener();
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Load timer from localStorage
    const savedTime = localStorage.getItem('focusTimer');
    const savedSessions = localStorage.getItem('focusSessions');
    if (savedTime) setTime(parseInt(savedTime));
    if (savedSessions) setSessions(parseInt(savedSessions));
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/signin');
    }
  }, [mounted, isLoading, user, router]);

  useEffect(() => {
    // Save timer to localStorage
    localStorage.setItem('focusTimer', time.toString());
  }, [time]);

  useEffect(() => {
    // Save sessions to localStorage
    localStorage.setItem('focusSessions', sessions.toString());
  }, [sessions]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      // Timer completed
      setSessions(s => s + 1);
      setTime(25 * 60); // Reset for next session
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  if (!mounted || isLoading || !user) {
    return <div className={`min-h-screen ${getThemeClasses().bg}`} />;
  }

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleReset = () => {
    setTime(25 * 60);
    setIsRunning(false);
  };

  const handleShortBreak = () => {
    setTime(5 * 60);
    setIsRunning(false);
  };

  const handleLongBreak = () => {
    setTime(15 * 60);
    setIsRunning(false);
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
              <h2 className={`text-3xl font-bold ${getThemeClasses().text} mb-2`}>⏰ Focus Timer</h2>
            </div>

            {/* Timer Section */}
            <div className={`${getThemeClasses().card} backdrop-blur rounded-lg p-12 border`}>
              <div className="flex flex-col items-center justify-center space-y-8">
                {/* Timer Display */}
                <div className={`text-9xl font-bold ${getThemeClasses().accent}`}>
                  {formattedTime}
                </div>

                {/* Sessions Count */}
                <div className="text-center">
                  <div className={`${getThemeClasses().mutedText} text-sm`}>Completed Sessions</div>
                  <div className={`text-4xl font-bold ${getThemeClasses().accent}`}>{sessions}</div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-6 py-3 rounded-lg font-bold text-lg transition-all flex items-center gap-2 ${
                      isRunning
                        ? `${getThemeClasses().button} ${getThemeClasses().hover}`
                        : `${getThemeClasses().accent} text-slate-900 hover:opacity-80`
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className={`px-6 py-3 rounded-lg font-bold text-lg ${getThemeClasses().button} ${getThemeClasses().hover} transition-all flex items-center gap-2`}
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                </div>

                {/* Break Options */}
                <div className="flex items-center gap-4 mt-8">
                  <button
                    onClick={handleShortBreak}
                    className={`px-6 py-2 rounded-lg font-semibold ${getThemeClasses().mutedText} transition-colors border ${getThemeClasses().border} ${getThemeClasses().hover}`}
                  >
                    Short Break (5m)
                  </button>
                  <button
                    onClick={handleLongBreak}
                    className={`px-6 py-2 rounded-lg font-semibold ${getThemeClasses().mutedText} transition-colors border ${getThemeClasses().border} ${getThemeClasses().hover}`}
                  >
                    Long Break (15m)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
