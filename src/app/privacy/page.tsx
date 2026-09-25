import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 px-6 max-w-3xl mx-auto space-y-6 text-slate-600">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <p>Last updated: October 2026</p>
        
        <p>Welcome to <strong>surakshpay.in</strong>. This Privacy Policy outlines our guidelines and practices regarding the collection, use, and disclosure of your information when you visit our website, even before logging in to the main dashboard.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect (Pre-Login & Post-Login)</h2>
        <p>Before logging in, we collect basic non-personally identifiable information such as browser type, operating system, and the pages you visit on surakshpay.in. Once you register, we collect business information including your business name, GST number, email address, and billing details.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Cookies & Privacy Settings</h2>
        <p>SurakshPay uses cookies and similar tracking technologies to track activity on our website and hold certain information. <strong>Cookies are used strictly for session management and basic website analytics.</strong> You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept essential cookies, you may not be able to log in or use portions of our SaaS platform.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. How We Use Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our invoice management software, to process software subscription payments, and to send you related information including product updates and invoices.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Data Security</h2>
        <p>We take reasonable and industry-standard measures to help protect information about your business and your customers from loss, theft, misuse, and unauthorized access. Data in transit is encrypted via HTTPS.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Contact</h2>
        <p>If you have any questions or concerns regarding our privacy practices or cookie policies at surakshpay.in, please reach out to us at eashansarosh@gmail.com.</p>
      </main>
      <Footer />
    </>
  );
}