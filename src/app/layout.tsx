import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SurakshPay | B2B Invoice Management Software',
  description: 'Generate professional invoices, track payments, and streamline high-value collections.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}