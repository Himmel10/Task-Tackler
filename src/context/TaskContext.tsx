'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskStats, TaskFilter } from '@/types/task';
import { 
  saveTasks, 
  loadTasks, 
  calculateStats, 
  filterTasks, 
  sortTasks, 
  searchTasks 
} from '@/lib/taskUtils';

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats;
  filteredTasks: Task[];
  filter: TaskFilter;
  searchQuery: string;
  sortBy: 'date' | 'priority' | 'category' | 'created';
  
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setFilter: (filter: TaskFilter) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'date' | 'priority' | 'category' | 'created') => void;
  clearFilter: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilterState] = useState<TaskFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category' | 'created'>('date');
  const [mounted, setMounted] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setMounted(true);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (mounted) {
      saveTasks(tasks);
    }
  }, [tasks, mounted]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...updates } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const setFilter = (newFilter: TaskFilter) => {
    setFilterState(newFilter);
  };

  const clearFilter = () => {
    setFilterState({});
    setSearchQuery('');
  };

  // Calculate filtered and sorted tasks
  let filteredTasks = tasks;
  
  if (searchQuery) {
    filteredTasks = searchTasks(filteredTasks, searchQuery);
  }
  
  filteredTasks = filterTasks(filteredTasks, filter);
  filteredTasks = sortTasks(filteredTasks, sortBy);

  const stats = calculateStats(tasks);

  const value: TaskContextType = {
    tasks,
    stats,
    filteredTasks,
    filter,
    searchQuery,
    sortBy,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    setFilter,
    setSearchQuery,
    setSortBy,
    clearFilter,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};
