import { getUTXOs } from '@/lib/wallet/regest';
import { PrivateKey } from '@bsv/sdk';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wif = 'L1tXvFktWLhJ7TZpWg6NBtFLnjguAUfnZhVMFtBVJ3WFM6TJKNKx';

  if (!wif) {
    return NextResponse.json({ error: 'WIF is required' }, { status: 400 });
  }

  try {
    const privateKey = PrivateKey.fromWif(wif);
    const address = privateKey.toAddress('testnet').toString();
    const utxos = await getUTXOs(address);
    const balance = utxos.reduce((acc: number, utxo: { value: number }) => acc + utxo.value, 0);

    return NextResponse.json({ balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Error fetching balance' }, { status: 500 });
  }
}
