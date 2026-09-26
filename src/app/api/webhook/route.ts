import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { raw_sms, secret } = body;

    // Security check
    if (secret !== 'surakshpay_secure_123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. EXTRACT AMOUNT (Matches "Rs 50,000", "INR 50000.00", or "₹50")
    const amountMatch = raw_sms.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d+)?)/i);
    if (!amountMatch) return NextResponse.json({ error: 'No amount found' }, { status: 400 });
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

    // 2. EXTRACT SENDER NAME (Matches "Info: ABDUL" or "from ABDUL")
    const nameMatch = raw_sms.match(/(?:from|Info:?|By:?)\s*([A-Za-z\s]+)(?:on|ref|to|-|$)/i);
    const senderName = nameMatch ? nameMatch[1].trim() : 'Unknown Sender';

    console.log(`🏦 New Bank Alert: ₹${amount} from ${senderName}`);

    // 3. THE MATCHING ENGINE
    // We intentionally leave all transactions as 'unmatched' initially.
    // At a busy petrol pump, we want the cashier to manually verify the sender's name 
    // on the screen before it turns green, preventing collisions for common amounts (like ₹500).
    const transactionStatus = 'unmatched';
    const matchedId = null;

    console.log(`⚠️ New payment logged as unmatched for manual cashier verification.`);

    // 4. LOG TO LEDGER
    await supabase.from('bank_transactions').insert({
      amount: amount,
      sender_name: senderName,
      raw_sms: raw_sms,
      status: transactionStatus,
      matched_invoice_id: matchedId
    });

    return NextResponse.json({ success: true, matched: false });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
