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

    // 1. EXTRACT AMOUNT (Matches "Rs 50,000" or "INR 50000.00")
    const amountMatch = raw_sms.match(/(?:Rs\.?|INR)\s*([\d,]+(?:\.\d+)?)/i);
    if (!amountMatch) return NextResponse.json({ error: 'No amount found' }, { status: 400 });
    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

    // 2. EXTRACT SENDER NAME (Matches "Info: ABDUL" or "from ABDUL")
    const nameMatch = raw_sms.match(/(?:from|Info:?|By:?)\s*([A-Za-z\s]+)(?:on|ref|to|-|$)/i);
    const senderName = nameMatch ? nameMatch[1].trim() : 'Unknown Sender';

    console.log(`🏦 New Bank Alert: ₹${amount} from ${senderName}`);

    // 3. THE MATCHING ENGINE
    const { data: pendingInvoices } = await supabase
      .from('invoices')
      .select('id')
      .eq('status', 'pending')
      .eq('amount', amount);

    let transactionStatus = 'unmatched';
    let matchedId = null;

    // RULE 1: Exact Match
    if (pendingInvoices && pendingInvoices.length === 1) {
      matchedId = pendingInvoices[0].id;
      transactionStatus = 'matched';

      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', matchedId);
      
      console.log(`✅ Auto-Matched to Invoice ${matchedId}`);
    } 
    // RULE 2: Collision
    else if (pendingInvoices && pendingInvoices.length > 1) {
      console.log(`⚠️ Collision detected! Left unmatched for cashier to verify.`);
    }

    // 4. LOG TO LEDGER
    await supabase.from('bank_transactions').insert({
      amount: amount,
      sender_name: senderName,
      raw_sms: raw_sms,
      status: transactionStatus,
      matched_invoice_id: matchedId
    });

    return NextResponse.json({ success: true, matched: transactionStatus === 'matched' });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
