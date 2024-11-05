import { startMonitor } from '@/lib/wallet/monitorTransactions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await startMonitor(); 
    return NextResponse.json({ message: 'Transaction monitor started' });
  } catch (error) {
    console.error('Error in starting monitor:', error);
    return NextResponse.json(
      { error: 'Failed to start transaction monitor' },
      { status: 500 }
    );
  }
}
