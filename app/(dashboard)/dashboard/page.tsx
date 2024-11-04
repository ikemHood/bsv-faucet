import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { fetchUser, fetchTransactions } from '@/lib/prisma';
import LatestTransactionsTable from '../latest-transactions-table';

export default async function DashboardPage() {
  const user = await fetchUser();
  if (!user) {
    return null;
  }
  const transactions = await fetchTransactions(user, 5);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Dashboard items.</CardDescription>
      </CardHeader>
      <CardContent>
        <LatestTransactionsTable user={user} transactions={transactions} />
      </CardContent>
    </Card>
  );
}
