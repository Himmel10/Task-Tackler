'use client';

import { Header, Sidebar } from '@/components';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useThemeListener } from '@/hooks/useThemeListener';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskData {
  id: string;
  title: string;
  dueDate: string | null;
}

export default function Calendar() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const { getThemeClasses } = useThemeListener();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState<Record<string, TaskData[]>>({});

  useEffect(() => {
    setMounted(true);
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

  const loadTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        
        // Group tasks by date
        const grouped: Record<string, TaskData[]> = {};
        data.forEach((task: TaskData) => {
          if (task.dueDate) {
            const date = new Date(task.dueDate).toISOString().split('T')[0];
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(task);
          }
        });
        setTasksByDate(grouped);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  if (!mounted || isLoading || !user) {
    return <div className={`min-h-screen ${getThemeClasses().bg}`} />;
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const emptyDays: (number | null)[] = Array.from({ length: firstDay }, () => null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const days: (number | null)[] = [...emptyDays, ...monthDays];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDateString = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const getTasksForDay = (day: number) => {
    return tasksByDate[getDateString(day)] || [];
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
              <h2 className={`text-3xl font-bold ${getThemeClasses().text} mb-2`}>📅 Calendar</h2>
            </div>

            {/* Smart Calendar */}
            <div className={`${getThemeClasses().card} backdrop-blur rounded-lg p-6 border`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${getThemeClasses().text}`}>Smart Calendar</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevMonth}
                    className={`p-2 ${getThemeClasses().hover} rounded-lg transition-colors`}
                  >
                    <ChevronLeft className={`w-5 h-5 ${getThemeClasses().text}`} />
                  </button>
                  <span className={`${getThemeClasses().accent} font-bold text-lg`}>{monthName}</span>
                  <button
                    onClick={nextMonth}
                    className={`p-2 ${getThemeClasses().hover} rounded-lg transition-colors`}
                  >
                    <ChevronRight className={`w-5 h-5 ${getThemeClasses().text}`} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className={`text-center ${getThemeClasses().accent} font-semibold py-2`}>
                      {day}
                    </div>
                  ))}
                  
                  {days.map((day, idx) => {
                    const dayTasks = day ? getTasksForDay(day) : [];
                    
                    return (
                      <div
                        key={idx}
                        className={`aspect-square p-2 rounded-lg border transition-colors ${
                          day === null
                            ? 'bg-transparent border-transparent'
                            : `${getThemeClasses().card} ${getThemeClasses().hover}`
                        }`}
                      >
                        <div className="h-full flex flex-col">
                          <div className={`text-sm font-bold ${getThemeClasses().text}`}>{day}</div>
                          {dayTasks.length > 0 && (
                            <div className="text-xs space-y-1 mt-1 overflow-hidden">
                              {dayTasks.slice(0, 2).map((task) => (
                                <div
                                  key={task.id}
                                  className={`${getThemeClasses().accent}/20 text-yellow-200 rounded px-1 py-0.5 truncate text-xs`}
                                  title={task.title}
                                >
                                  {task.title.slice(0, 15)}...
                                </div>
                              ))}
                              {dayTasks.length > 2 && (
                                <div className={`${getThemeClasses().accent} text-xs`}>+{dayTasks.length - 2} more</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
