'use client';

import { useTasks } from '@/context/TaskContext';
import { Task } from '@/types/task';
import { isOverdue, getDaysUntilDue } from '@/lib/taskUtils';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Critical': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
    case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Work': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
    case 'Personal': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
    case 'Shopping': return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200';
    case 'Health': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
    case 'Education': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200';
  }
};

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { toggleComplete, deleteTask } = useTasks();
  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const isTaskOverdue = isOverdue(task.dueDate, task.completed);

  return (
    <div
      className={`
        bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 
        p-4 hover:shadow-md transition-shadow
        ${task.completed ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(task.id)}
          className="mt-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`
              font-semibold text-gray-900 dark:text-white
              ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}
            `}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>

            {/* Due Date */}
            <span
              className={`
                text-xs font-medium px-2 py-1 rounded
                ${
                  isTaskOverdue
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                    : daysUntilDue <= 3
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
                }
              `}
            >
              {isTaskOverdue ? '⚠️ Overdue' : `${daysUntilDue}d`}
            </span>

            {task.recurrence !== 'NONE' && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                🔄 {task.recurrence}
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this task?')) {
              deleteTask(task.id);
            }
          }}
          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
