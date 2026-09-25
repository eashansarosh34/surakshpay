import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function Refunds() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 px-6 max-w-3xl mx-auto space-y-6 text-slate-600">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Refund & Cancellation Policy</h1>
        <p>Last updated: October 2026</p>
        
        <p>This policy outlines the refund and cancellation terms for software subscriptions purchased on <strong>surakshpay.in</strong>.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Subscription Plans</h2>
        <p>SurakshPay offers multiple tiers of B2B invoice management software, including our primary Growth plan billed at a flat SaaS fee of <strong>₹1,999 per month</strong>.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Cancellations</h2>
        <p>You may cancel your SurakshPay subscription at any time from your billing dashboard. Your cancellation will take effect at the end of the current paid term. If you cancel, you will not be billed for any additional terms, but your software access will remain active until the end of the current billing cycle.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Refunds</h2>
        <p>Because of the nature of digital software and cloud hosting costs, <strong>the ₹1,999 monthly SaaS subscription fee (and any other tier fees) is strictly non-refundable</strong> once processed. We do not provide refunds or credits for any partial-month subscription periods, unused software features, or account inactivity.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Exceptions</h2>
        <p>In the rare event of a technical billing error or accidental duplicate charge originating from our payment gateway partners, a full refund for the incorrect duplicate charge will be issued within 5-7 business days of verification.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
        <p>If you have any questions about our Returns and Refunds Policy, or need help managing your subscription at surakshpay.in, please contact us at eashansarosh@gmail.com.</p>
      </main>
      <Footer />
    </>
  );
}