import { fetchUser, fetchTransactions } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { stringify as csvStringifySync } from 'csv-stringify/sync';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await fetchUser();
  if (!user) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Unauthorized'
    });
  }
  const transactions = await fetchTransactions(user);
  const transactionsCsv = transactions.map((transaction) => {
    const result: Record<string, any> = {};
    result['Tx ID'] = transaction.txid;
    result['Date'] = transaction.date.toLocaleString();
    if (user.role === 'admin' && transaction.user) {
      result['Account'] =
        `${transaction.user.username} <${transaction.user.email}>`;
    }
    result['Beef Tx'] = transaction.beefTx;
    result['Tx Type'] = transaction.txType;
    result['Amount'] = transaction.amount;
    result['Status'] = transaction.spentStatus ? 'Spent' : 'Unspent';
    return result;
  });
  const csvString = csvStringifySync(transactionsCsv, {
    header: true,
    delimiter: ';'
  });
  return new NextResponse(csvString, {
    headers: { 'Content-Disposition': 'attachment; filename="requests.csv"' }
  });
}
