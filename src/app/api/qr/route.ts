import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys not configured on server' }, { status: 500 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    // Generate a unique reference ID for this transaction
    const refId = `INV_${Date.now()}`;

    // 1. Call Razorpay API to create a Payment Link (Standard, enabled for all accounts)
    const rzpRes = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects paise (e.g. 5000 = 500000 paise)
        currency: "INR",
        accept_partial: false,
        reference_id: refId,
        description: `B2B Invoice ${refId}`,
        customer: {
          name: "B2B Client",
          contact: "+919999999999",
          email: "billing@client.com"
        },
        notify: {
          sms: false,
          email: false
        },
        reminder_enable: false
      })
    });

    const data = await rzpRes.json();
    
    if (data.error) {
      console.error("Razorpay Error:", data.error);
      return NextResponse.json({ error: data.error.description }, { status: 400 });
    }

    // 2. Extract the Payment Link Short URL
    // Standard Payment links don't give a direct raw UPI string, but we can generate a generic UPI string 
    // or just pass the short_url to be encoded in the QR code so they can scan and pay!
    const shortUrl = data.short_url;
    
    return NextResponse.json({ 
      vpa: "payment_link",
      upiString: shortUrl, // We will encode the URL into the QR code instead of a raw UPI string
      reference_id: refId,
      virtual_account_id: data.id
    });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
