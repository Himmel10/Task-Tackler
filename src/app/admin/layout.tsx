'use client';

import { ReactNode } from 'react';
import { AdminProtected } from '@/components';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminProtected>{children}</AdminProtected>;
}
