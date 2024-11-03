import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from '@/components/ui/card';
  import DonationForm from '@/components/DonationForm';
import DonationHistory from './Donation-history';
  
  export default function DashboardPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Donate</CardTitle>
          <CardDescription>Donate to the Beef Treasury.</CardDescription>
        </CardHeader>
        <CardContent>
          <DonationForm />
        </CardContent>
        <DonationHistory />
      </Card>
    );
  }
  