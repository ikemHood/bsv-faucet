import { getUTXOs } from '@/lib/wallet/regest';
import { PrivateKey } from '@bsv/sdk';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const treasuryWIF = process.env.TREASURY_WALLET_WIF;
    if (!treasuryWIF) {
      return NextResponse.json({ error: 'No wallet found' }, { status: 404 });
    }

    const privateKey = PrivateKey.fromWif(treasuryWIF);
    const address = privateKey.toAddress('testnet').toString();
    const utxos = await getUTXOs(address);

    if (!utxos || utxos.length === 0) {
      return NextResponse.json({ balance: 0 });
    }

    const balance = utxos.reduce(
      (acc: number, utxo: { value: number }) => acc + utxo.value,
      0
    );

    return NextResponse.json({ balance });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching balance' },
      { status: 500 }
    );
  }
}
