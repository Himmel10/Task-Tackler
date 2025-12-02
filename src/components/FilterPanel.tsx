'use client';

import { useTasks } from '@/context/TaskContext';
import { TaskCategory, TaskPriority } from '@/types/task';
import { Filter } from 'lucide-react';

export const FilterPanel = () => {
  const { filter, setFilter, clearFilter, setSortBy, sortBy } = useTasks();

  const categories: TaskCategory[] = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Other'];
  const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const sortOptions = ['date', 'priority', 'category', 'created'] as const;

  const hasActiveFilters = Object.keys(filter).length > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filters & Sort</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilter}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filter.category || ''}
            onChange={(e) =>
              setFilter({
                ...filter,
                category: (e.target.value as TaskCategory) || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            value={filter.priority || ''}
            onChange={(e) =>
              setFilter({
                ...filter,
                priority: (e.target.value as TaskPriority) || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            {priorities.map((pri) => (
              <option key={pri} value={pri}>
                {pri}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filter.completed === undefined ? '' : filter.completed ? 'completed' : 'pending'}
            onChange={(e) => {
              if (e.target.value === '') {
                setFilter({ ...filter, completed: undefined });
              } else {
                setFilter({ ...filter, completed: e.target.value === 'completed' });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};
