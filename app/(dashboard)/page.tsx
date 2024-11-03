import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import DonationForm from '@/components/DonationForm';

export default function DashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Dashboard items.</CardDescription>
      </CardHeader>
      <CardContent>
        <DonationForm />
      </CardContent>
    </Card>
  );
}
