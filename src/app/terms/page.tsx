import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 px-6 max-w-3xl mx-auto space-y-6 text-slate-600">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        <p>Last updated: October 2026</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using the website located at <strong>surakshpay.in</strong> (the "Site") and the SurakshPay SaaS platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
        <p>SurakshPay is a B2B invoice management software provided as a Service (SaaS). We provide software tools to help businesses generate invoices and track payment statuses. <strong>We do not act as a payment gateway, payment aggregator, or financial institution.</strong> All transactions initiated through our platform are processed by authorized third-party gateways or settled via direct bank transfers between businesses. We do not hold, pool, or take custody of any merchant funds.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. User Responsibilities</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials, including any data generated prior to or after logging into surakshpay.in. You agree to use the platform solely for legitimate B2B business operations.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Governing Law</h2>
        <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions shall be subject to the exclusive jurisdiction of the courts of Telangana, India.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Contact</h2>
        <p>If you have any questions about these Terms, please contact us at eashansarosh@gmail.com.</p>
      </main>
      <Footer />
    </>
  );
}