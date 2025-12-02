'use client';

import { Header, Sidebar, EnhancedTaskForm } from '@/components';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useThemeListener } from '@/hooks/useThemeListener';
import { useRouter } from 'next/navigation';

interface TaskData {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
  category?: string;
  priority?: string;
  recurrence?: string;
  tags?: string[];
}

interface WeeklyData {
  [key: string]: number;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const { getThemeClasses } = useThemeListener();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

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
      setLoading(true);
      const response = await fetch(`/api/tasks?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        setTaskCount(data.length);
        setCompletedCount(data.filter((t: TaskData) => t.status === 'COMPLETED').length);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTaskCount(taskCount + 1);
        setShowAddForm(false);
      } else {
        alert('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task');
    }
  };

  if (!mounted || isLoading || !user) {
    return <div className={`min-h-screen ${getThemeClasses().bg}`} />;
  }

  const themeClasses = getThemeClasses();
  const weeklyData: WeeklyData = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };
  const upcomingTasks = tasks.filter((t) => t.status !== 'COMPLETED').slice(0, 5);

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        
        <main className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Page Title */}
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${themeClasses.text} mb-1 sm:mb-2`}>Dashboard</h2>
              <p className={`text-sm sm:text-base ${themeClasses.accent}`}>Welcome back, {user.username}!</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className={`${themeClasses.card} rounded-xl p-4 sm:p-6`}>
                <div className={`${themeClasses.accent} text-xs sm:text-sm font-semibold mb-2`}>Total Tasks</div>
                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${themeClasses.text}`}>{taskCount}</div>
              </div>
              <div className={`${themeClasses.card} rounded-xl p-4 sm:p-6`}>
                <div className={`${themeClasses.accent} text-xs sm:text-sm font-semibold mb-2`}>Completed</div>
                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold text-green-500`}>{completedCount}</div>
              </div>
              <div className={`${themeClasses.card} rounded-xl p-4 sm:p-6`}>
                <div className={`${themeClasses.accent} text-xs sm:text-sm font-semibold mb-2`}>In Progress</div>
                <div className={`text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500`}>{taskCount - completedCount}</div>
              </div>
            </div>

            {/* Quick Add Task */}
            {showAddForm ? (
              <EnhancedTaskForm
                onSubmit={handleAddTask}
                onCancel={() => setShowAddForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className={`w-full ${themeClasses.button} py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base`}
              >
                + Add New Task
              </button>
            )}

            {/* Upcoming Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className={`lg:col-span-2 ${themeClasses.card} rounded-xl p-4 sm:p-6`}>
                <h3 className={`text-lg sm:text-xl font-bold ${themeClasses.text} mb-3 sm:mb-4`}>📅 Upcoming Tasks</h3>
                <div className="space-y-2">
                  {loading ? (
                    <div className={`text-sm ${themeClasses.accent}`}>Loading tasks...</div>
                  ) : upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task) => (
                      <div key={task.id} className={`${themeClasses.hover} rounded-lg px-3 sm:px-4 py-2 sm:py-3 ${themeClasses.text} transition-colors text-sm sm:text-base`}>
                        <div className="font-semibold truncate">{task.title}</div>
                        {task.dueDate && (
                          <div className={`text-xs sm:text-sm ${themeClasses.accent}`}>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className={`text-sm ${themeClasses.accent}`}>No upcoming tasks</div>
                  )}
                </div>
              </div>
              
              <div className={`${themeClasses.card} rounded-xl p-4 sm:p-6`}>
                <h3 className={`text-lg sm:text-xl font-bold ${themeClasses.text} mb-3 sm:mb-4`}>📊 Weekly</h3>
                <div className={`space-y-2 ${themeClasses.text} text-xs sm:text-sm`}>
                  {Object.entries(weeklyData).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className={`font-bold ${themeClasses.accent}`}>{day}</span>
                      <span>{hours}h</span>
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
