'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export function ConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [canAccept, setCanAccept] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkConsent = async () => {
      // 1. Fast check local storage first
      if (localStorage.getItem('surakshpay_consent_accepted') === 'true') {
        return;
      }

      // 2. Check Supabase Auth Metadata (if connected)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.user_metadata?.terms_accepted) {
          localStorage.setItem('surakshpay_consent_accepted', 'true');
          return;
        }
      } catch (e) {
        // Ignore auth errors if using mock login
      }

      // If not accepted yet, show the modal
      setIsOpen(true);
    };
    
    checkConsent();
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // Check if user scrolled to the bottom (with a small 10px buffer)
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setCanAccept(true);
    }
  };

  const handleAccept = async () => {
    // Hide UI instantly and save to browser cache
    setIsOpen(false);
    localStorage.setItem('surakshpay_consent_accepted', 'true');

    // Permanently save to Supabase Database (if connected)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: { 
            terms_accepted: true, 
            terms_accepted_at: new Date().toISOString() 
          }
        });
      }
    } catch (e) {
      console.error("Auth update skipped");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Data Processing & Privacy Agreement</h2>
          <p className="text-sm text-blue-600 mt-1 font-medium">Please scroll to the bottom to accept.</p>
        </div>
        
        {/* Scrollable Content */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 space-y-4"
        >
            <p><strong>Last Updated: October 2026</strong></p>
            <p>Welcome to SurakshPay. To provide you with real-time payment reconciliation and automated audio alerts, SurakshPay requires access to specific transactional data. By clicking "I Accept" below, you explicitly consent to the following data processing practices in accordance with the Digital Personal Data Protection (DPDP) Act, 2023.</p>
            
            <h3 className="font-bold text-gray-900 mt-4 text-base">1. Data We Collect (The "Purpose")</h3>
            <p>To instantly verify your customer payments and trigger your dashboard, you grant SurakshPay permission to process:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>Banking SMS & Notifications:</strong> We request access to your device’s SMS and Push Notifications strictly to read transaction alerts sent by your bank or UPI provider.</li>
                <li><strong>Forwarded Bank Emails:</strong> If utilizing our Email Engine, you consent to auto-forwarding your banking transaction emails to our secure servers for real-time parsing.</li>
            </ul>

            <h3 className="font-bold text-gray-900 mt-4 text-base">2. Strict Data Exclusions (What We Do NOT Read)</h3>
            <p>Your privacy is our priority. Our systems are hard-coded to ignore non-financial data.</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>We <strong>do not</strong> and cannot read your personal text messages.</li>
                <li>We <strong>do not</strong> read, store, or process One-Time Passwords (OTPs).</li>
                <li>We <strong>do not</strong> access personal emails outside of the automated bank receipts forwarded to our system.</li>
            </ul>

            <h3 className="font-bold text-gray-900 mt-4 text-base">3. Data Storage and Minimization</h3>
            <p>SurakshPay only extracts the transaction amount, timestamp, and sender's first name (or reference number) required to update your business ledger. We do not store the raw text of your SMS or emails after the transaction has been successfully matched and reconciled.</p>

            <h3 className="font-bold text-gray-900 mt-4 text-base">4. Data Sharing & Security</h3>
            <p>Your financial ledger is strictly confidential. SurakshPay will never sell your transaction data, customer names, or business volumes to third-party marketers or advertisers. Data is encrypted and stored securely on cloud infrastructure.</p>

            <h3 className="font-bold text-gray-900 mt-4 text-base">5. Right to Withdraw Consent</h3>
            <p>You have the right to withdraw this consent at any time by disabling the SMS/Notification permissions on your device, deleting your email forwarding rule, or contacting your SurakshPay representative to terminate your account. Note that withdrawing consent will disable the real-time audio alerts and automated ledger matching.</p>
            
            <p className="italic pt-4 text-gray-500">By clicking "I Accept", you acknowledge that you have read, understood, and agree to this Data Processing Agreement.</p>
        </div>

        {/* Footer with Button */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end items-center">
          {!canAccept && <span className="text-sm text-gray-400 mr-4">Scroll to bottom to enable button</span>}
          <button 
            onClick={handleAccept}
            disabled={!canAccept}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
              canAccept 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
}
