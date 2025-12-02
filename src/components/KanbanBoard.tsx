import { useState } from 'react';
import { Task } from '@/types/task';
import { Plus, Trash2 } from 'lucide-react';

interface KanbanProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newStatus: string) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onAddTask?: (status: string) => void;
}

const STATUS_COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'REVIEW', title: 'Review', color: 'bg-purple-100' },
  { id: 'COMPLETED', title: 'Done', color: 'bg-green-100' },
];

export default function KanbanBoard({ tasks, onTaskMove, onTaskDelete, onAddTask }: Omit<KanbanProps, 'onTaskUpdate'>) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => (task.status || 'TODO') === status);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedTask && draggedTask.status !== status) {
      onTaskMove?.(draggedTask.id, status);
      setDraggedTask(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'border-l-4 border-red-500';
      case 'HIGH':
        return 'border-l-4 border-orange-500';
      case 'MEDIUM':
        return 'border-l-4 border-yellow-500';
      default:
        return 'border-l-4 border-green-500';
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-x-auto">
      <div className="flex gap-6 min-w-max">
        {STATUS_COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              {/* Column header */}
              <div className={`${column.color} p-4 rounded-t-lg`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded text-sm">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
                className="p-4 min-h-96 space-y-3"
              >
                {columnTasks.length === 0 && (
                  <div className="text-gray-400 dark:text-gray-600 text-center py-8">
                    No tasks
                  </div>
                )}

                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className={`
                      p-3 bg-gray-50 dark:bg-gray-700 rounded border-l-4 cursor-move
                      hover:shadow-md transition
                      ${getPriorityColor(task.priority)}
                      ${draggedTask?.id === task.id ? 'opacity-50' : 'opacity-100'}
                    `}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm text-gray-800 dark:text-white ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}>
                          {task.title}
                        </h4>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {task.category && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              {task.category}
                            </span>
                          )}
                          {task.priority && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              task.priority === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                        {task.dueDate && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onTaskDelete?.(task.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add new task button */}
                <button
                  onClick={() => onAddTask?.(column.id)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  <Plus size={18} className="mx-auto" />
                  Add task
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
