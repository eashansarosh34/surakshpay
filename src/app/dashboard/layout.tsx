'use client';

import { RoleGuard } from '@/components/auth/RoleGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['MERCHANT', 'SUPPORT']}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Main Content (Header is now in page.tsx) */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
