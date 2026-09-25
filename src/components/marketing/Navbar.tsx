'use client';
import Link from 'next/link';
import { setMockRole } from '@/components/auth/RoleGuard';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">S</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">SurakshPay</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}