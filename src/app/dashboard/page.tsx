'use client';

import { useState, useEffect } from 'react';
import { Check, Scan, MonitorSmartphone, Volume2, Loader2, FileText, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const [amountInput, setAmountInput] = useState('');
  const [generatedAmount, setGeneratedAmount] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [suggestedMatch, setSuggestedMatch] = useState<any>(null);

  // New States for Ledger and Collision
  const [ledger, setLedger] = useState<any[]>([]);
  const [showManualModal, setShowManualModal] = useState(false);
  const [unmatchedTxs, setUnmatchedTxs] = useState<any[]>([]);

  // MERCHANT DETAILS
  const merchantAccount = "41814643181";
  const merchantIFSC = "SBIN0020514";
  const merchantBank = "State Bank of India (SBI)";

  const playVoiceAlert = (amount: number) => {
    try {
      new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play();
      if ('speechSynthesis' in window) {
        const text = `Payment of ${amount} rupees received successfully.`;
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      }
    } catch (e) {}
  };

  // Fetch Ledger Data
  const fetchLedger = async () => {
    const { data } = await supabase
      .from('bank_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
    if (data) setLedger(data);
  };

  useEffect(() => {
    fetchLedger();
  }, [isPaid]); // Refresh ledger when a payment is completed

  // 1. GENERATE BILL & SAVE TO DATABASE
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amountInput);
    if (isNaN(amountVal) || amountVal <= 0) return;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ amount: amountVal, status: 'pending' }])
        .select()
        .single();

      if (error) {
          alert("Supabase says: " + error.message);
          return;
      }

      setGeneratedAmount(amountVal);
      setActiveInvoiceId(data.id);
      setIsPaid(false);
      setSuggestedMatch(null);

      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://surakshpay.in';
      const invoiceUrl = `${origin}/invoice/${data.id}?acc=${merchantAccount}&ifsc=${merchantIFSC}&bank=${encodeURIComponent(merchantBank)}`;
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(invoiceUrl)}`);
    } catch (err) {
      console.error("Database Error:", err);
    }
  };

  // 2. REAL-TIME DATABASE LISTENER
  useEffect(() => {
    if (!activeInvoiceId) return;

    const invoiceChannel = supabase
      .channel('payment_listener')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'invoices', filter: `id=eq.${activeInvoiceId}` },
        (payload) => {
          if (payload.new.status === 'paid') {
            setIsPaid(true);
            playVoiceAlert(payload.new.amount);
          }
        }
      )
      .subscribe();

    const bankChannel = supabase
      .channel('bank_listener')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bank_transactions' },
        (payload) => {
          setLedger((prev) => [payload.new, ...prev].slice(0, 6));
          if (payload.new.status === 'unmatched') {
            setSuggestedMatch(payload.new);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bank_transactions' },
        (payload) => {
          // Update the ledger row instantly across all devices
          setLedger((prev) => prev.map(tx => tx.id === payload.new.id ? payload.new : tx));
          
          // If another terminal claimed this payment, remove it from our screen instantly
          setSuggestedMatch((current: any) => {
            if (current && current.id === payload.new.id && payload.new.status === 'matched') {
              return null;
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(invoiceChannel);
      supabase.removeChannel(bankChannel);
    };
  }, [activeInvoiceId, generatedAmount]);

  // Collision Handling
  const openManualModal = async () => {
    setShowManualModal(true);
    const { data } = await supabase
      .from('bank_transactions')
      .select('*')
      .eq('status', 'unmatched')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setUnmatchedTxs(data);
  };

  const handleManualMatch = async (tx: any) => {
    if (!activeInvoiceId) return;

    // Safety Check: If cashier clicks an item with a different amount
    if (tx.amount !== generatedAmount) {
      const confirmMatch = window.confirm(`⚠️ WARNING: The bill is for ₹${generatedAmount}, but this payment is for ₹${tx.amount}.\n\nAre you sure you want to match these?`);
      if (!confirmMatch) return;
    }

    // 1. Mark invoice as paid
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', activeInvoiceId);
    // 2. Mark transaction as matched
    await supabase.from('bank_transactions').update({ status: 'matched', matched_invoice_id: activeInvoiceId }).eq('id', tx.id);
    
    setShowManualModal(false);
    setSuggestedMatch(null); // Clear any popup
    setGeneratedAmount(tx.amount); // Update the green screen to show the ACTUAL money received
    setIsPaid(true);
    playVoiceAlert(tx.amount); // Voice box shouts the ACTUAL money received
    fetchLedger();
  };

  const handleLedgerConfirm = async (tx: any) => {
    // This ONLY updates the ledger row. It does NOT touch the active bill on screen.
    // It does NOT play a sound. It just marks it as dealt with.
    await supabase.from('bank_transactions').update({ status: 'matched' }).eq('id', tx.id);
    fetchLedger();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-24 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div>
            <h1 className="text-2xl font-black tracking-tight">SurakshPay <span className="text-blue-400">Pro</span></h1>
            <p className="text-slate-400 text-sm mt-1">Dual-Pricing Automated Terminal</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/10 px-6 py-3 rounded-xl border border-white/20 text-center">
            <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">MDR Saved Today</p>
            <p className="text-2xl font-black text-white">₹12,400</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: CASHIER INPUT */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col min-h-[450px]">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
                  <MonitorSmartphone size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-800">New Payment</h2>
                  <p className="text-sm text-slate-500">Enter bill amount</p>
                </div>
              </div>
              
              <form onSubmit={handleGenerate} className="flex-1 flex flex-col">
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Total Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-2xl">₹</span>
                    <input
                      type="number"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-5 text-4xl font-black text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full mt-auto py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <Scan size={24} /> Generate Terminal
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: THE TERMINAL */}
          <div className="lg:col-span-8 bg-slate-200 rounded-2xl border-4 border-slate-300 flex items-center justify-center p-6 min-h-[450px]">
            {!activeInvoiceId ? (
              <div className="text-center text-slate-400">
                <Scan size={64} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium text-lg tracking-wide">Waiting for amount...</p>
              </div>
            ) : isPaid ? (
              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full">
                <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/40">
                  <Check size={56} className="text-white" />
                </div>
                <h3 className="text-5xl font-black text-slate-900 mb-4">₹{generatedAmount?.toLocaleString('en-IN')}</h3>
                <p className="text-green-600 font-black uppercase tracking-[0.2em] text-lg">Bank Transfer Verified</p>
              </div>
            ) : (
              <div className="w-full max-w-3xl flex flex-col items-center">
                <div className="w-full bg-white border-8 border-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-black text-xs md:text-sm tracking-widest shadow-lg flex items-center gap-2 whitespace-nowrap">
                    <Loader2 size={18} className="animate-spin" /> SECURE LIVE NETWORK...
                  </div>

                  <div className="text-center mb-6 mt-4">
                    <p className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
                      ₹{generatedAmount?.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex justify-center mb-6 flex-col items-center">
                    <div className="bg-white p-3 rounded-2xl border-4 border-slate-100 shadow-md transition-transform hover:scale-105 cursor-pointer">
                      {qrUrl ? <a href={`/invoice/${activeInvoiceId}?acc=${merchantAccount}&ifsc=${merchantIFSC}`} target="_blank" rel="noreferrer"><img src={qrUrl} alt="Smart Invoice QR" className="w-48 h-48 md:w-56 md:h-56 object-contain" /></a> : <div className="w-48 h-48 bg-slate-100 animate-pulse rounded-xl"></div>}
                    </div>
                  </div>

                  {suggestedMatch && !isPaid && (
                    <div className="w-full mt-2 mb-6 bg-green-50 border-2 border-green-500 rounded-2xl p-4 text-center">
                      <p className="text-sm font-bold text-green-700 uppercase tracking-widest mb-1">Incoming Payment Detected</p>
                      <p className="text-2xl font-black text-slate-900 mb-3">₹{suggestedMatch.amount} from {suggestedMatch.sender_name}</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => setSuggestedMatch(null)}
                          className="w-full py-3 bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-200 font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95"
                        >
                          Waitlist
                        </button>
                        <button 
                          onClick={() => handleManualMatch(suggestedMatch)}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wider rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-95"
                        >
                          Confirm & Accept
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-3xl mt-6 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-5 py-4 rounded-xl border-2 border-blue-200 shadow-sm animate-pulse">
                    <Volume2 size={20} /> Soundbox Active
                  </div>
                  <button onClick={openManualModal} className="flex-1 py-4 bg-slate-800 hover:bg-slate-900 text-white font-black uppercase tracking-[0.1em] text-sm md:text-md rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2">
                    <AlertCircle size={20} /> Manual Match
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM LEDGER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <FileText size={20} />
            <h2 className="font-bold text-lg">Live Transaction Ledger</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-bold uppercase tracking-wider">Amount</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Sender</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Time</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((tx, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 font-black text-slate-900">₹{tx.amount}</td>
                    <td className="py-4 text-slate-600 font-medium">{tx.sender_name}</td>
                    <td className="py-4">
                      {tx.status === 'matched' ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-xs">Matched</span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold text-xs">Waitlist</span>
                      )}
                    </td>
                    <td className="py-4 text-slate-400">{new Date(tx.created_at).toLocaleTimeString()}</td>
                    <td className="py-4 text-right">
                      {tx.status === 'unmatched' && (
                        <button 
                          onClick={() => handleLedgerConfirm(tx)} 
                          className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {ledger.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-slate-400">No transactions yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MANUAL MATCH MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-xl text-slate-800">Manual Match (Collision Resolver)</h3>
                <p className="text-sm text-slate-500 mt-1">Select the correct bank transfer for this bill.</p>
              </div>
              <button onClick={() => setShowManualModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} className="text-slate-500" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {unmatchedTxs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No unmatched bank transfers found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unmatchedTxs.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-2xl hover:border-blue-500 transition-colors">
                      <div>
                        <p className="font-black text-xl text-slate-900">₹{tx.amount}</p>
                        <p className="text-sm text-slate-500">From: <strong className="text-slate-800">{tx.sender_name}</strong></p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(tx.created_at).toLocaleTimeString()}</p>
                      </div>
                      <button onClick={() => handleManualMatch(tx)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95">
                        Match to Bill
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
