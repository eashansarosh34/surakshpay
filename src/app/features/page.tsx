import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function Features() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">Features</h1>
        <p className="text-lg text-slate-600 text-center mb-16 max-w-2xl mx-auto">Everything you need to manage your business billing effectively.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Invoice Generation</h3>
            <p className="text-slate-600">Create GST-compliant invoices in seconds. Customize them with your branding and business details effortlessly.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Payment Tracking</h3>
            <p className="text-slate-600">Real-time dashboard to see exactly which invoices are paid and which are pending. Never lose track of a collection again.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Reconciliation</h3>
            <p className="text-slate-600">No more manual matching of bank transfers to invoices. Our system automatically marks invoices as paid when funds settle.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-3">High-Value Collections</h3>
            <p className="text-slate-600">Designed specifically for businesses handling large B2B transactions safely, securely, and professionally.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}