import { getUTXOs } from '@/lib/wallet/regest';
import { PrivateKey } from '@bsv/sdk';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const wallet = await prisma.wallet.findFirst();

    if (!wallet) {
      return NextResponse.json({ error: 'No wallet found' }, { status: 404 });
    }

    if (!wallet.privateKey) {
      return NextResponse.json({ error: 'Private key is missing' }, { status: 400 });
    }

    const privateKey = PrivateKey.fromWif(wallet.privateKey);
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
