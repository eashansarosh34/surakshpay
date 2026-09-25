import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function Pricing() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-600">Choose the plan that fits your business scale.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
            <p className="text-slate-500 mb-6">For small businesses</p>
            <p className="text-4xl font-bold text-slate-900 mb-8">₹499<span className="text-lg text-slate-500 font-medium">/mo</span></p>
            <ul className="space-y-4 mb-8 flex-1 text-slate-600">
              <li className="flex items-center gap-2">✓ Up to 50 invoices/mo</li>
              <li className="flex items-center gap-2">✓ Basic tracking</li>
              <li className="flex items-center gap-2">✓ Email support</li>
            </ul>
            <button className="w-full py-3 rounded-lg font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">Select Plan</button>
          </div>
          
          {/* Growth */}
          <div className="bg-blue-600 p-8 rounded-2xl shadow-xl flex flex-col transform md:-translate-y-4 text-white">
            <div className="bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full self-start mb-4">Most Popular</div>
            <h3 className="text-2xl font-bold mb-2">Growth</h3>
            <p className="text-blue-100 mb-6">For high-volume businesses</p>
            <p className="text-4xl font-bold mb-8">₹1,999<span className="text-lg text-blue-200 font-medium">/mo</span></p>
            <ul className="space-y-4 mb-8 flex-1 text-blue-50">
              <li className="flex items-center gap-2">✓ Unlimited invoices</li>
              <li className="flex items-center gap-2">✓ Automated reconciliation</li>
              <li className="flex items-center gap-2">✓ Priority support</li>
            </ul>
            <button className="w-full py-3 rounded-lg font-bold bg-white text-blue-600 hover:bg-slate-50 transition-colors">Select Plan</button>
          </div>

          {/* Enterprise */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
            <p className="text-slate-500 mb-6">Custom tailored solutions</p>
            <p className="text-4xl font-bold text-slate-900 mb-8">Custom</p>
            <ul className="space-y-4 mb-8 flex-1 text-slate-600">
              <li className="flex items-center gap-2">✓ Custom API access</li>
              <li className="flex items-center gap-2">✓ Dedicated account manager</li>
              <li className="flex items-center gap-2">✓ Custom ERP integrations</li>
            </ul>
            <button className="w-full py-3 rounded-lg font-bold border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors">Contact Us</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}