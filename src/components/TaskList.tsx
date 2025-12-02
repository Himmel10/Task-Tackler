'use client';

import { useTasks } from '@/context/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';

export const TaskList = () => {
  const { filteredTasks } = useTasks();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tasks ({filteredTasks.length})
        </h2>
        <TaskForm />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No tasks found. Create a new task to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
