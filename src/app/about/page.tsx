import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 px-6 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">About Us</h1>
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm mb-12">
          <p className="text-lg text-slate-700 leading-relaxed">
            SurakshPay is a fast-growing tech startup built in India to help B2B businesses manage their invoices and collect payments efficiently. 
            Born out of the need to simplify complex B2B workflows, our software bridges the gap between professional invoicing and accurate accounting. 
            <br/><br/>
            <strong>Please note: We are a pure software service (SaaS) and do not hold, pool, or touch merchant funds. All payments are settled directly between businesses.</strong>
          </p>
        </div>
        <div className="aspect-video bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-medium">
          [Team Image Placeholder]
        </div>
      </main>
      <Footer />
    </>
  );
}