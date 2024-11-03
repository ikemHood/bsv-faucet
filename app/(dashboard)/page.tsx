import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export default function DashboardPage() {
  return (
    <Card>
      <CardHeader>
          <div className="flex w-full justify-between">
            <CardTitle>Dashboard</CardTitle>
            <Button variant="outline" onClick={() => {
              window.location.href = '/donate';
            }}>
              <RefreshCcw className="w-4 h-4" /> Donate
            </Button>
          </div>
        <CardDescription>Dashboard items.</CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
}
