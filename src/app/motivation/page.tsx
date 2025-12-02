'use client';

import { Header, Sidebar } from '@/components';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useThemeListener } from '@/hooks/useThemeListener';
import { Award } from 'lucide-react';

interface TaskData {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export default function Motivation() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { getThemeClasses } = useThemeListener();
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'Getting Started', description: 'Created your first task', unlocked: false },
    { id: '2', title: 'Productive Day', description: 'Completed 5 tasks in a day', unlocked: false },
    { id: '3', title: 'Perfect Week', description: 'Completed 20 tasks in a week', unlocked: false },
    { id: '4', title: 'Consistent', description: 'Maintain a 7-day streak', unlocked: false },
  ]);

  const quotes = [
    "Bright goals, brighter wins.",
    "Focus on what matters most.",
    "Every task completed is a victory.",
    "Progress over perfection.",
    "You've got this!",
    "One step at a time.",
    "You are capable of amazing things.",
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    setMounted(true);
    // Load streak from localStorage
    const savedStreak = localStorage.getItem('taskStreak');
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/signin');
    }
  }, [mounted, isLoading, user, router]);

  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user]);

  useEffect(() => {
    // Save streak to localStorage
    localStorage.setItem('taskStreak', streak.toString());
  }, [streak]);

  const loadTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();

        // Check achievements
        const newAchievements = [...achievements];
        if (data.length > 0) {
          newAchievements[0].unlocked = true;
        }
        const todayCompleted = data.filter(
          (t: TaskData) => t.status === 'COMPLETED' && new Date(t.createdAt).toDateString() === new Date().toDateString()
        ).length;
        if (todayCompleted >= 5) {
          newAchievements[1].unlocked = true;
        }
        if (data.filter((t: TaskData) => t.status === 'COMPLETED').length >= 20) {
          newAchievements[2].unlocked = true;
        }
        if (streak >= 7) {
          newAchievements[3].unlocked = true;
        }
        setAchievements(newAchievements);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  if (!mounted || isLoading || !user) {
    return <div className={`min-h-screen ${getThemeClasses().bg}`} />;
  }

  const handleNewQuote = () => {
    let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    // Ensure we get a different quote
    while (randomQuote === currentQuote && quotes.length > 1) {
      randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    setCurrentQuote(randomQuote);
  };

  if (!mounted || !user || isLoading) {
    return <div className={`min-h-screen ${getThemeClasses().bg}`} />;
  }

  return (
    <div className={`min-h-screen ${getThemeClasses().bg}`}>
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Page Title */}
            <div>
              <h2 className={`text-3xl font-bold ${getThemeClasses().text} mb-2`}>💪 Motivation</h2>
            </div>

            {/* Motivation Zone */}
            <div className={`${getThemeClasses().card} backdrop-blur rounded-lg p-8 border`}>
              <h3 className={`text-2xl font-bold ${getThemeClasses().text} mb-8`}>💪 Motivation Zone</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Daily Quote */}
                <div className={`${getThemeClasses().cardAlt} rounded-lg p-6 border`}>
                  <h4 className={`${getThemeClasses().accent} font-bold mb-3`}>Daily Quote</h4>
                  <p className={`${getThemeClasses().text} text-lg italic mb-4`}>"{currentQuote}"</p>
                  <button
                    onClick={handleNewQuote}
                    className={`w-full ${getThemeClasses().cardAlt} hover:opacity-80 ${getThemeClasses().text} py-2 rounded transition-colors font-semibold`}
                  >
                    New Quote
                  </button>
                </div>

                {/* Streak */}
                <div className={`${getThemeClasses().cardAlt} rounded-lg p-6 border flex flex-col items-center justify-center`}>
                  <div className={`text-6xl font-bold ${getThemeClasses().text} mb-2`}>{streak}</div>
                  <h4 className={`${getThemeClasses().text} font-bold`}>Day Streak</h4>
                  <p className={`${getThemeClasses().mutedText} text-sm mt-2`}>Keep going!</p>
                </div>
              </div>

              {/* Achievements */}
              <div className={`${getThemeClasses().cardAlt} rounded-lg p-6 border`}>
                <h4 className={`${getThemeClasses().text} font-bold mb-4`}>Achievements</h4>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 rounded-lg p-3 border ${
                        achievement.unlocked
                          ? `${getThemeClasses().accent}/20 border-current`
                          : 'bg-gray-500/20 border-gray-500 opacity-50'
                      }`}
                    >
                      <Award className={`w-6 h-6 ${achievement.unlocked ? getThemeClasses().accent : 'text-gray-400'}`} />
                      <div>
                        <div className={`font-bold ${achievement.unlocked ? getThemeClasses().accent : getThemeClasses().dimText}`}>
                          {achievement.title}
                        </div>
                        <div className={`text-sm ${achievement.unlocked ? getThemeClasses().mutedText : getThemeClasses().dimText}`}>
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
