import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    const serializableTransactions = transactions.map(transaction => ({
      id: transaction.id,
      txid: transaction.txid,
      rawTx: transaction.rawTx,
      beefTx: transaction.beefTx,
      vout: transaction.vout,
      txType: transaction.txType,
      spentStatus: transaction.spentStatus,
      testnetFlag: transaction.testnetFlag,
      amount: transaction.amount.toString(),
      date: transaction.date.toISOString(),
    }));

    return NextResponse.json(serializableTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
