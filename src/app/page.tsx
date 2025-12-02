'use client';

import { Header, Sidebar, EnhancedTaskForm } from '@/components';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useThemeListener } from '@/hooks/useThemeListener';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface TaskData {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
  priority?: string;
  category?: string;
  recurrence?: string;
  tags?: string[];
}

function HomeContent() {
  const { user, isLoading } = useAuth();
  const { getThemeClasses } = useThemeListener();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [isLoading, user, router]);

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
        setShowAddForm(false);
      } else if (response.status === 500) {
        alert('Database connection error. Please ensure your database is running.');
      } else {
        alert('Failed to add task. Please try again.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please check your connection.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getFilteredAndSortedTasks = () => {
    let filtered = tasks;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter(t => t.status !== 'COMPLETED');
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(t => t.status === 'COMPLETED');
    }

    // Sort
    if (sortBy === 'priority') {
      const priorityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
      filtered = [...filtered].sort((a, b) => {
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;
        return aPriority - bPriority;
      });
    } else {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime()
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredAndSortedTasks();
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter(t => t.status !== 'COMPLETED').length;

  if (!mounted || !user || isLoading) {
    const { bg } = getThemeClasses();
    return <div className={`min-h-screen ${bg}`} />;
  }

  const themeClasses = getThemeClasses();

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <Header />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        
        <main className="flex-1 w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Statistics - Mobile Responsive */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4`}>
              <div className={`${themeClasses.card} rounded-xl p-3 sm:p-4 text-center`}>
                <div className={`${themeClasses.accent} text-xl sm:text-2xl font-bold`}>{tasks.length}</div>
                <div className={`${themeClasses.text} text-xs sm:text-sm`}>Total Tasks</div>
              </div>
              <div className={`${themeClasses.card} rounded-xl p-3 sm:p-4 text-center`}>
                <div className="text-green-500 text-xl sm:text-2xl font-bold">{completedCount}</div>
                <div className={`${themeClasses.text} text-xs sm:text-sm`}>Completed</div>
              </div>
              <div className={`${themeClasses.card} rounded-xl p-3 sm:p-4 text-center`}>
                <div className="text-orange-500 text-xl sm:text-2xl font-bold">{pendingCount}</div>
                <div className={`${themeClasses.text} text-xs sm:text-sm`}>Pending</div>
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
                className={`${themeClasses.button} font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center sm:justify-start gap-2 shadow-md hover:shadow-lg w-full sm:w-auto`}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add New Task</span>
                <span className="sm:hidden">Add Task</span>
              </button>
            )}

            {/* Search and Filters */}
            <div className={`${themeClasses.card} rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4`}>
              <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${themeClasses.input} rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2`}
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    filterStatus === 'all'
                      ? `${themeClasses.button}`
                      : `${themeClasses.text} ${themeClasses.hover}`
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    filterStatus === 'active'
                      ? `${themeClasses.button}`
                      : `${themeClasses.text} ${themeClasses.hover}`
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    filterStatus === 'completed'
                      ? `${themeClasses.button}`
                      : `${themeClasses.text} ${themeClasses.hover}`
                  }`}
                >
                  Done
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
                  className={`col-span-2 sm:col-span-1 ${themeClasses.input} rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none`}
                >
                  <option value="date">Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>

            {/* Tasks List */}
            <div className={`${themeClasses.card} rounded-xl overflow-hidden shadow-md`}>
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className={`text-lg sm:text-xl font-bold ${themeClasses.text} mb-3 sm:mb-4 flex items-center gap-2`}>
                  <CheckCircle className="w-5 h-5" />
                  My Tasks {filteredTasks.length > 0 && <span className={`text-xs sm:text-sm ${themeClasses.accent}`}>({filteredTasks.length})</span>}
                </h3>
                
                {loading ? (
                  <div className={`text-center py-6 sm:py-8 ${themeClasses.accent}`}>Loading tasks...</div>
                ) : filteredTasks.length === 0 ? (
                  <div className={`text-center py-8 sm:py-12 ${themeClasses.accent}`}>
                    <Circle className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                    <p className="text-sm sm:text-base">{searchQuery || filterStatus !== 'all' ? 'No tasks found' : 'No tasks yet. Create your first one!'}</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-start sm:items-center gap-2 sm:gap-4 rounded-lg p-3 sm:p-4 transition-all group border ${
                          task.status === 'COMPLETED'
                            ? `${themeClasses.card} opacity-60`
                            : `${themeClasses.card} hover:shadow-md`
                        }`}
                      >
                        <button
                          onClick={() => handleToggleComplete(task.id, task.status)}
                          className="flex-shrink-0 transition-all hover:scale-110 mt-0.5 sm:mt-0"
                        >
                          {task.status === 'COMPLETED' ? (
                            <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-500" />
                          ) : (
                            <Circle className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400 hover:text-green-500" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm sm:text-base break-words ${
                            task.status === 'COMPLETED'
                              ? `${themeClasses.text} line-through opacity-60`
                              : themeClasses.text
                          }`}>
                            {task.title}
                          </h4>
                          <div className="flex flex-col gap-1 mt-1">
                            {task.dueDate && (
                              <p className={`text-xs sm:text-sm ${themeClasses.accent} opacity-75`}>
                                📅 {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            )}
                            {task.priority && (
                              <span className={`text-xs px-2 py-0.5 rounded font-semibold w-fit ${
                                task.priority === 'CRITICAL' ? 'bg-red-500/30 text-red-600' :
                                task.priority === 'HIGH' ? 'bg-orange-500/30 text-orange-600' :
                                task.priority === 'MEDIUM' ? 'bg-yellow-500/30 text-yellow-600' :
                                'bg-blue-500/30 text-blue-600'
                              }`}>
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className={`p-1 sm:p-2 text-red-500 ${themeClasses.hover} rounded transition-colors`}
                            title="Delete task"
                          >
                            <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
