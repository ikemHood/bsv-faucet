import { startSpentMonitor } from '@/lib/wallet/updateSpentStatus';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await startSpentMonitor(); 
    return NextResponse.json({ message: 'Spent status monitor started' });
  } catch (error) {
    console.error('Error in starting monitor:', error);
    return NextResponse.json(
      { error: 'Failed to start spent status monitor' },
      { status: 500 }
    );
  }
}
