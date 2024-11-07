import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/prisma/generated/client';
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const user = await currentUser();
  const userId = user?.id;
  const searchParams = request.nextUrl.searchParams;
  const userIdParam = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (userIdParam && userIdParam !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        date: 'desc'
      },
      take: 5 
    });

    const serializableTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      txid: transaction.txid,
      rawTx: transaction.rawTx,
      beefTx: transaction.beefTx,
      vout: transaction.vout,
      txType: transaction.txType,
      spentStatus: transaction.spentStatus,
      testnetFlag: transaction.testnetFlag,
      amount: transaction.amount.toString(),
      date: transaction.date.toISOString()
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