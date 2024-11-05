import AdminTreasuryHistory from '@/components/adminTreasuryHistory/AdminTreasuryHistory';
import TreasuryDepositHistory from '@/components/adminTreasuryHistory/TreasuryDepositHistory';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function AdminPage() {
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
