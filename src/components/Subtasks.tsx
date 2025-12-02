import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

interface SubtasksProps {
  taskId: string;
  subtasks: Subtask[];
  onAddSubtask?: (taskId: string, title: string) => void;
  onToggleSubtask?: (subtaskId: string) => void;
  onDeleteSubtask?: (subtaskId: string) => void;
}

export default function Subtasks({
  taskId,
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: SubtasksProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask?.(taskId, newSubtaskTitle);
      setNewSubtaskTitle('');
      setIsAdding(false);
    }
  };

  const completedCount = subtasks.filter((s) => s.completed).length;
  const completionPercentage = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Subtasks</span>
            <span>{completedCount}/{subtasks.length}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtasks list */}
      <div className="space-y-2">
        {subtasks
          .sort((a, b) => a.order - b.order)
          .map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <button
                onClick={() => onToggleSubtask?.(subtask.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  subtask.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                }`}
              >
                {subtask.completed && <Check size={16} className="text-white" />}
              </button>
              <span
                className={`flex-1 text-sm ${
                  subtask.completed
                    ? 'text-gray-400 dark:text-gray-500 line-through'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {subtask.title}
              </span>
              <button
                onClick={() => onDeleteSubtask?.(subtask.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
      </div>

      {/* Add subtask form */}
      {isAdding ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSubtask();
              if (e.key === 'Escape') {
                setIsAdding(false);
                setNewSubtaskTitle('');
              }
            }}
            placeholder="Add a subtask..."
            autoFocus
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddSubtask}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewSubtaskTitle('');
            }}
            className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 p-2 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
        >
          <Plus size={18} />
          Add subtask
        </button>
      )}
    </div>
  );
}
