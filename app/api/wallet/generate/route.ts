import { generateWallet } from '@/lib/wallet/generateWallet';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const wallet = generateWallet();
    return NextResponse.json({
      walletId: (await wallet).walletId,
      testnetAddress: (await wallet).testnetAddress
    });
  } catch (error) {
    console.error('Failed to generate wallet:', error);
    return NextResponse.json(
      { error: 'Failed to generate wallet' },
      { status: 500 }
    );
  }
}
