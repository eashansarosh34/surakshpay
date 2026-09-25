import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');
  
  if (!ref) {
    return NextResponse.json({ error: 'Missing reference_id' }, { status: 400 });
  }

  const statuses = (global as any).paymentStatuses || {};
  const status = statuses[ref];

  if (status) {
    return NextResponse.json(status);
  } else {
    return NextResponse.json({ status: 'PENDING' });
  }
}
