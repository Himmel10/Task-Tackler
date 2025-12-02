import { Task } from '@/types/task';

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the Q1 project proposal and submit for review',
    category: 'Work',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    recurrence: 'NONE',
    tags: ['urgent', 'project'],
  },
  {
    id: '2',
    title: 'Grocery shopping',
    description: 'Buy milk, eggs, bread, and vegetables',
    category: 'Shopping',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    recurrence: 'WEEKLY',
    tags: ['errands'],
  },
  {
    id: '3',
    title: 'Doctor appointment',
    description: 'Annual checkup with Dr. Smith',
    category: 'Health',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
    recurrence: 'YEARLY',
    tags: ['health', 'appointment'],
  },
  {
    id: '4',
    title: 'Study React patterns',
    description: 'Review Context API and custom hooks patterns',
    category: 'Education',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
    recurrence: 'NONE',
    tags: ['learning', 'react'],
  },
  {
    id: '5',
    title: 'Call mom',
    description: 'Weekly family call',
    category: 'Personal',
    priority: 'LOW',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    recurrence: 'WEEKLY',
    tags: ['family'],
  },
  {
    id: '6',
    title: 'Code review',
    description: 'Review pull requests from team members',
    category: 'Work',
    priority: 'CRITICAL',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
    recurrence: 'DAILY',
    tags: ['work', 'priority'],
  },
];

export const loadSampleData = (): void => {
  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem('task-tackler-tasks');
    if (!existing) {
      localStorage.setItem('task-tackler-tasks', JSON.stringify(sampleTasks));
    }
  }
};
