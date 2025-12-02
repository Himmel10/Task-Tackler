import { User } from '@/types/auth';

const AUTH_STORAGE_KEY = 'task-tackler-auth';
const USERS_STORAGE_KEY = 'task-tackler-users';

// Simple password hashing (for demo - use bcrypt in production)
export const hashPassword = (password: string): string => {
  return btoa(password); // Base64 encoding (NOT secure for production)
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return btoa(password) === hash;
};

// User Management
export const saveUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    const users = loadAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
};

export const loadAllUsers = (): User[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = loadAllUsers();
  return users.find(u => u.email === email.toLowerCase());
};

export const getUserById = (id: string): User | undefined => {
  const users = loadAllUsers();
  return users.find(u => u.id === id);
};

export const deleteUser = (id: string): void => {
  if (typeof window !== 'undefined') {
    const users = loadAllUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
  }
};

// Authentication
export const saveAuthUser = (user: User | null): void => {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
};

export const loadAuthUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

// Admin Stats
export const calculateAdminStats = (users: User[], allTasks: any[]) => {
  const totalUsers = users.length;
  const totalTasks = allTasks.length;
  const activeUsers = users.length; // Simplified
  const completedTasks = allTasks.filter(t => t.completed).length;
  const averageTasksPerUser = totalUsers > 0 ? totalTasks / totalUsers : 0;
  const averageCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalUsers,
    totalTasks,
    activeUsers,
    completedTasks,
    averageTasksPerUser: Math.round(averageTasksPerUser * 10) / 10,
    averageCompletionRate: Math.round(averageCompletionRate),
  };
};

// Create demo admin user if none exists (syncs to database)
export const initializeDemoAdmin = async (): Promise<void> => {
  try {
    // Check if admin exists in database
    const res = await fetch('/api/users?email=admin@tasktackler.com');
    if (res.ok) {
      return; // Admin already exists
    }

    // Create demo admin in database
    const createRes = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@tasktackler.com',
        username: 'admin',
        password: 'admin123',
        role: 'ADMIN',
      }),
    });

    if (!createRes.ok) {
      console.error('Failed to create demo admin');
    }
  } catch (error) {
    console.error('Error initializing demo admin:', error);
  }
};
