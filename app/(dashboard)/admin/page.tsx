import AdminTreasuryHistory from '@/components/adminTreasuryHistory/AdminTreasuryHistory';
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
    </Card>
  );
}
