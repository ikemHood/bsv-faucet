import { generateWallet } from '@/lib/wallet/generateWallet';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const wallet = await generateWallet();
    return NextResponse.json({
      walletId: wallet.walletId,
      testnetAddress: wallet.testnetAddress
    });
  } catch (error) {
    console.error('Failed to generate wallet:', error);
    return NextResponse.json(
      { error: 'Failed to generate wallet' },
      { status: 500 }
    );
  }
}
