export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // hashed in production
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, username: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  setUser: (user: User | null) => void;
}

export interface AdminStats {
  totalUsers: number;
  totalTasks: number;
  activeUsers: number;
  completedTasks: number;
  averageTasksPerUser: number;
  averageCompletionRate: number;
}

export interface UserWithTaskCount extends User {
  taskCount: number;
  completedTasks: number;
}
