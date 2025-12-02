'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useThemeListener } from '@/hooks/useThemeListener';

interface EnhancedTaskFormProps {
  onSubmit: (task: {
    title: string;
    category: string;
    priority: string;
    recurrence: string;
    tags: string[];
    dueDate?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: 'EDUCATION', label: 'Education', emoji: '📚' },
  { value: 'HEALTH', label: 'Health', emoji: '🏥' },
  { value: 'WORK', label: 'Work', emoji: '💼' },
  { value: 'PERSONAL', label: 'Personal', emoji: '👤' },
  { value: 'SHOPPING', label: 'Shopping', emoji: '🛒' },
  { value: 'FINANCE', label: 'Finance', emoji: '💰' },
  { value: 'OTHER', label: 'Other', emoji: '📌' },
];

const RECURRENCE_OPTIONS = [
  { value: 'NONE', label: 'No repeat' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
];

export default function EnhancedTaskForm({ onSubmit, onCancel }: EnhancedTaskFormProps) {
  const { getThemeClasses } = useThemeListener();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [daysUntilDue, setDaysUntilDue] = useState('');
  const [recurrence, setRecurrence] = useState('NONE');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = getThemeClasses();

  // Calculate priority based on days until due date
  const calculatePriority = (days: string): string => {
    if (!days) return 'MEDIUM';
    const daysNum = parseInt(days);
    if (daysNum <= 1) return 'CRITICAL';
    if (daysNum <= 3) return 'HIGH';
    if (daysNum <= 7) return 'MEDIUM';
    return 'LOW';
  };

  const priority = calculatePriority(daysUntilDue);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    try {
      const dueDate = daysUntilDue
        ? new Date(Date.now() + parseInt(daysUntilDue) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : undefined;

      await onSubmit({
        title: title.trim(),
        category,
        priority,
        recurrence,
        tags,
        dueDate,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${theme.card} rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4`}>
      {/* Title */}
      <div>
        <label className={`block text-sm font-semibold ${theme.text} mb-2`}>Task Title</label>
        <input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
          }}
          autoFocus
          className={`w-full ${theme.input} rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2`}
        />
      </div>

      {/* Category and Due Date Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Category */}
        <div>
          <label className={`block text-xs sm:text-sm font-semibold ${theme.text} mb-1.5 sm:mb-2`}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full ${theme.input} rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Days Until Due */}
        <div>
          <label className={`block text-xs sm:text-sm font-semibold ${theme.text} mb-1.5 sm:mb-2`}>Due in (days)</label>
          <input
            type="number"
            placeholder="e.g., 15"
            value={daysUntilDue}
            onChange={(e) => setDaysUntilDue(e.target.value)}
            min="0"
            className={`w-full ${theme.input} rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2`}
          />
        </div>
      </div>

      {/* Priority and Recurrence Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Priority (Auto-calculated) */}
        <div>
          <label className={`block text-xs sm:text-sm font-semibold ${theme.text} mb-1.5 sm:mb-2`}>Priority</label>
          <div className={`w-full ${theme.input} rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex items-center`}>
            <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
              priority === 'CRITICAL' ? 'bg-red-500/30 text-red-600' :
              priority === 'HIGH' ? 'bg-orange-500/30 text-orange-600' :
              priority === 'MEDIUM' ? 'bg-yellow-500/30 text-yellow-600' :
              'bg-green-500/30 text-green-600'
            }`}>
              {priority}
            </span>
          </div>
        </div>

        {/* Recurrence */}
        <div>
          <label className={`block text-xs sm:text-sm font-semibold ${theme.text} mb-1.5 sm:mb-2`}>Repeat</label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className={`w-full ${theme.input} rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2`}
          >
            {RECURRENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className={`block text-xs sm:text-sm font-semibold ${theme.text} mb-1.5 sm:mb-2`}>Tags</label>
        <div className={`${theme.input} rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex flex-wrap gap-2 items-start`}>
          {tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${theme.accent} bg-opacity-20`}
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className={`flex-1 min-w-fit bg-transparent focus:outline-none text-xs sm:text-sm ${theme.text}`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 sm:gap-3 justify-end pt-2 sm:pt-4">
        <button
          onClick={onCancel}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-semibold ${theme.text} ${theme.hover} transition-colors`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-semibold ${theme.button} disabled:opacity-50`}
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </div>
  );
}
