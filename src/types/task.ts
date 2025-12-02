export type TaskCategory = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Education' | 'Other';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ARCHIVED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate: string; // ISO date string
  completed: boolean;
  createdAt: string;
  recurrence: RecurrenceType;
  subtasks?: Subtask[];
  tags?: string[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byCategory: Record<TaskCategory, number>;
  byPriority: Record<TaskPriority, number>;
}

export interface TaskFilter {
  category?: TaskCategory;
  priority?: TaskPriority;
  completed?: boolean;
  dueDateRange?: {
    start: string;
    end: string;
  };
}
