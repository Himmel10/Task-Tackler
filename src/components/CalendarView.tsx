import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, getDate } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarTask {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  completed: boolean;
}

interface CalendarProps {
  tasks: CalendarTask[];
  onDateClick?: (date: Date) => void;
  onTaskClick?: (task: CalendarTask) => void;
}

export default function Calendar({ tasks, onDateClick, onTaskClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const weekStart = startOfWeek(monthStart);
  const weekEnd = endOfWeek(monthEnd);

  const days = [];
  let day = weekStart;
  while (day <= weekEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return format(task.dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(addDays(currentDate, -30))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 30))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const dayTasks = getTasksForDate(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <div
              key={index}
              onClick={() => onDateClick?.(day)}
              className={`
                min-h-24 p-2 rounded border cursor-pointer transition
                ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900'}
                ${isToday ? 'border-blue-500 border-2' : 'border-gray-200 dark:border-gray-700'}
                hover:shadow-md
              `}
            >
              <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-500' : ''}`}>
                {getDate(day)}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                    className={`
                      text-xs p-1 rounded text-white truncate cursor-pointer
                      ${getPriorityColor(task.priority)}
                      ${task.completed ? 'opacity-50 line-through' : ''}
                      hover:opacity-100
                    `}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
