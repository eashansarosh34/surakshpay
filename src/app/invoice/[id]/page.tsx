'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, ShieldCheck, Building2 } from 'lucide-react';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [acc, setAcc] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bank, setBank] = useState('');
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [amount, setAmount] = useState('0');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setAcc(urlParams.get('acc') || '41814643181');
    setIfsc(urlParams.get('ifsc') || 'SBIN0020514');
    setBank(urlParams.get('bank') || 'State Bank of India (SBI)');
    
    // In a real app we'd fetch the exact amount from Supabase using the invoice ID
    // For this UI demo, we can just say "Scan complete" or fetch it
  }, []);

  const copyToClipboard = (text: string, type: 'acc' | 'ifsc') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col pb-12">
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-center gap-2 shadow-sm">
        <ShieldCheck className="text-green-500" size={24} />
        <h1 className="font-black text-lg tracking-tight">VIP Bank Transfer</h1>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col gap-6 mt-4">
        
        {/* INSTRUCTION BANNER */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 items-start">
          <Building2 className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">How to pay</h3>
            <p className="text-xs text-blue-800 font-medium leading-relaxed">
              Open PhonePe or GPay. Select <strong>"Bank Transfer"</strong>. Copy and paste the details below to complete your payment securely.
            </p>
          </div>
        </div>

        {/* COPY DETAILS SECTION */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-600"></div>
          <h2 className="font-black text-lg mb-6 text-center">Copy Bank Details</h2>
          
          <div className="space-y-5">
            {/* BANK NAME */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bank Name</p>
                <p className="font-mono font-black text-xl tracking-wider text-slate-700">{bank}</p>
              </div>
            </div>

            {/* ACCOUNT NUMBER */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                <p className="font-mono font-black text-2xl tracking-wider">{acc}</p>
              </div>
              <button onClick={() => copyToClipboard(acc, 'acc')} className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm hover:border-blue-500 active:scale-95 transition-all">
                {copiedAcc ? <Check size={24} className="text-green-500" /> : <Copy size={24} className="text-blue-600" />}
              </button>
            </div>

            {/* IFSC CODE */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex justify-between items-center group">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">IFSC Code</p>
                <p className="font-mono font-black text-2xl tracking-wider">{ifsc}</p>
              </div>
              <button onClick={() => copyToClipboard(ifsc, 'ifsc')} className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-sm hover:border-blue-500 active:scale-95 transition-all">
                {copiedIfsc ? <Check size={24} className="text-green-500" /> : <Copy size={24} className="text-blue-600" />}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
