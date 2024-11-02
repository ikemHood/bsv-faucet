import { createAndSendTransaction } from '@/lib/wallet/transactions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { wif, toAddress, amount } = await req.json();

  if (!wif || !toAddress || !amount) {
    return NextResponse.json(
      { error: 'wif, toAddress, and amount are required' },
      { status: 400 }
    );
  }

  try {
    const txid = await createAndSendTransaction(wif, toAddress, amount);
    return NextResponse.json({ txid });
  } catch (error) {
    console.error('Error sending transaction:', error);
    return NextResponse.json(
      { error: 'Error sending transaction' },
      { status: 500 }
    );
  }
}
