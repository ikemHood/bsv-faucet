import AdminTreasuryHistory from '@/components/adminTreasuryHistory/AdminTreasuryHistory';
import TreasuryDepositHistory from '@/components/adminTreasuryHistory/TreasuryDepositHistory';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { fetchUser } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await fetchUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin</CardTitle>
        <CardDescription>Admin items.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>

      <AdminTreasuryHistory />
      <TreasuryDepositHistory />
    </Card>
  );
}
