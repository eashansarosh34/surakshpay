'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'MERCHANT' | 'ADMIN' | 'SUPPORT';

const INACTIVITY_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Mocking the current user's role for the demo.
export const getCurrentRole = (): UserRole | null => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('user_role') as UserRole) || null;
  }
  return null;
};

export const setMockRole = (role: UserRole | null) => {
  if (typeof window !== 'undefined') {
    if (role) {
      localStorage.setItem('user_role', role);
      localStorage.setItem('last_active', Date.now().toString());
      window.location.reload();
    } else {
      localStorage.removeItem('user_role');
      localStorage.removeItem('last_active');
    }
  }
};

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const role = getCurrentRole();
    
    if (!role) {
      router.push('/login');
      return;
    }

    // 1. Inactivity Logout Logic
    const checkInactivity = () => {
      const lastActive = localStorage.getItem('last_active');
      if (lastActive && Date.now() - parseInt(lastActive, 10) > INACTIVITY_TIMEOUT_MS) {
        setMockRole(null);
        router.push('/login');
        return true; // was inactive
      }
      return false;
    };

    // Run check on mount
    if (checkInactivity()) return;

    const updateActivity = () => {
      localStorage.setItem('last_active', Date.now().toString());
    };

    // Throttle activity updates to once every 5 seconds to preserve performance
    let throttleTimer: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          updateActivity();
          throttleTimer = null;
        }, 5000);
      }
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, handleActivity));

    // Check periodically if left open in a background tab
    const interval = setInterval(() => {
      checkInactivity();
    }, 60000);

    // 2. Role Verification
    if (!allowedRoles.includes(role)) {
      setAuthorized(false);
      // Strictly block access. Return 403-like state or redirect
      if (role === 'MERCHANT') {
        router.push('/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setAuthorized(true);
    }

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [allowedRoles, router, pathname]);

  if (authorized === null) {
    return <div className="p-8 text-center text-gray-500">Checking access...</div>;
  }

  if (authorized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">403 Forbidden</h1>
        <p className="text-gray-500 mb-6">You do not have permission to view this page.</p>
        <button 
          onClick={() => router.push(getCurrentRole() === 'ADMIN' ? '/admin' : '/dashboard')}
          className="bg-emerald-600 text-white px-4 py-2 rounded font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
