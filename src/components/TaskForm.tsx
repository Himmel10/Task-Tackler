'use client';

import { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';
import { Task, TaskCategory, TaskPriority, RecurrenceType } from '@/types/task';
import { Plus, X } from 'lucide-react';

export const TaskForm = () => {
  const { addTask } = useTasks();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal' as TaskCategory,
    priority: 'MEDIUM' as TaskPriority,
    dueDate: new Date().toISOString().split('T')[0],
    recurrence: 'NONE' as RecurrenceType,
    tags: '',
  });

  const categories: TaskCategory[] = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Other'];
  const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const recurrences: RecurrenceType[] = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

  const getThemeColors = () => {
    const colors: Record<string, { bg: string; border: string; button: string; text: string; input: string }> = {
      purple: {
        bg: 'bg-purple-900',
        border: 'border-purple-700',
        button: 'bg-yellow-400 hover:bg-yellow-500 text-purple-900',
        text: 'text-white',
        input: 'bg-purple-800 border-purple-700 text-white placeholder-purple-400',
      },
      blue: {
        bg: 'bg-blue-900',
        border: 'border-blue-700',
        button: 'bg-cyan-400 hover:bg-cyan-500 text-blue-900',
        text: 'text-white',
        input: 'bg-blue-800 border-blue-700 text-white placeholder-blue-400',
      },
      green: {
        bg: 'bg-emerald-900',
        border: 'border-emerald-700',
        button: 'bg-lime-400 hover:bg-lime-500 text-emerald-900',
        text: 'text-white',
        input: 'bg-emerald-800 border-emerald-700 text-white placeholder-emerald-400',
      },
      dark: {
        bg: 'bg-slate-800',
        border: 'border-slate-700',
        button: 'bg-slate-600 hover:bg-slate-500 text-white',
        text: 'text-white',
        input: 'bg-slate-700 border-slate-600 text-white placeholder-slate-400',
      },
      light: {
        bg: 'bg-white',
        border: 'border-gray-300',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        text: 'text-gray-900',
        input: 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500',
      },
    };
    return colors[theme] || colors.purple;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      recurrence: formData.recurrence,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
    };

    addTask(newTask);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'Personal',
      priority: 'MEDIUM',
      dueDate: new Date().toISOString().split('T')[0],
      recurrence: 'NONE',
      tags: '',
    });
    setIsOpen(false);
  };

  const colors = getThemeColors();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 ${colors.button} font-bold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl`}
      >
        <Plus className="w-5 h-5" />
        Add Task
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${colors.bg} ${colors.border} rounded-lg shadow-2xl max-w-md w-full max-h-screen overflow-y-auto border`}>
        <div className={`sticky top-0 ${colors.bg} ${colors.border} border-b p-6 flex items-center justify-between`}>
          <h2 className={`text-xl font-bold ${colors.text}`}>Add New Task</h2>
          <button
            onClick={() => setIsOpen(false)}
            className={`${colors.text} hover:opacity-70 transition-opacity`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter task title"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.input}`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter task description"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none ${colors.input}`}
              rows={3}
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as TaskCategory})}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.input}`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as TaskPriority})}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.input}`}
            >
              {priorities.map(pri => (
                <option key={pri} value={pri}>{pri}</option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.input}`}
            />
          </div>

          {/* Recurrence */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Recurrence
            </label>
            <select
              value={formData.recurrence}
              onChange={(e) => setFormData({...formData, recurrence: e.target.value as RecurrenceType})}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.input}`}
            >
              {recurrences.map(rec => (
                <option key={rec} value={rec}>{rec}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium ${colors.text} mb-2`}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="e.g., urgent, review, follow-up"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.input}`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${colors.border} ${colors.text} hover:opacity-80`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 ${colors.button} font-bold rounded-lg transition-colors`}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
