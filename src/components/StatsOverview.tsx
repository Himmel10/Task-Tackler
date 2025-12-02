'use client';

import { useTasks } from '@/context/TaskContext';
import { BarChart3, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export const StatsOverview = () => {
  const { stats } = useTasks();

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Tasks */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
          </div>
          <BarChart3 className="w-12 h-12 text-blue-500 opacity-20" />
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.completed}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{completionPercentage}%</p>
          </div>
          <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2">{stats.pending}</p>
          </div>
          <TrendingUp className="w-12 h-12 text-amber-500 opacity-20" />
        </div>
      </div>

      {/* Overdue */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Overdue</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats.overdue}</p>
          </div>
          <AlertCircle className="w-12 h-12 text-red-500 opacity-20" />
        </div>
      </div>
    </div>
  );
};
