"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Copy, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: string;
  description: string;
  timestamp: string;
  beefTx: string;
}

interface TreasuryData {
  balanceBSV: number;
  balanceSatoshis: number;
  lowBalanceThreshold: number;
  isLowBalance: boolean;
  recentTransactions: Transaction[];
}

const AdminTreasury = () => {
  const [treasuryData, setTreasuryData] = useState<TreasuryData>({
    balanceBSV: 0,
    balanceSatoshis: 0,
    lowBalanceThreshold: 10,
    isLowBalance: false,
    recentTransactions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  type DepositTransaction = {
    date: string;
    txid: string;
    beefTx: string;
    vout: number;
    txType: 'deposit';
    amount: number;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch deposit history
        const historyResponse = await fetch('/api/deposit-history');
        if (!historyResponse.ok) {
          throw new Error('Failed to fetch deposit history');
        }
        const transactions: DepositTransaction[] = await historyResponse.json();

        // Calculate total balance from transactions
        const totalSatoshis = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const balanceBSV = totalSatoshis / 100000000;

        setTreasuryData({
          balanceBSV,
          balanceSatoshis: totalSatoshis,
          lowBalanceThreshold: 10,
          isLowBalance: balanceBSV < 10,
          recentTransactions: transactions.map(tx => ({
            id: tx.txid,
            type: tx.txType,
            amount: tx.amount.toString(),
            description: `BeefTx: ${tx.beefTx}, Vout: ${tx.vout}`,
            timestamp: tx.date,
            beefTx: tx.beefTx
          }))
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch treasury data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const formatSatoshisToBSV = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleMineBlock = () => {
    console.log('Mining block');
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between">
            <CardTitle>Treasury Balance</CardTitle>
            <div className="relative">
              <Button variant="outline" className={treasuryData.isLowBalance ? 'animate-pulse border-destructive' : ''} onClick={handleMineBlock}>
                <RefreshCcw className="w-4 h-4" /> Mine Block
              </Button>
              {treasuryData.isLowBalance && (
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm font-medium">Balance (BSV)</div>
                <div className="text-2xl font-bold">
                  {treasuryData.balanceBSV.toFixed(8)}
                </div>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm font-medium">Balance (Satoshis)</div>
                <div className="text-2xl font-bold">
                  {Math.floor(treasuryData.balanceSatoshis).toLocaleString()}
                </div>
              </div>
            </div>

            {treasuryData.isLowBalance && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Low Balance Warning</AlertTitle>
                <AlertDescription>
                  Treasury balance is below the threshold of {treasuryData.lowBalanceThreshold} BSV.
                  Please add funds to ensure continuous operation.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {treasuryData.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">
                    {tx.type === 'deposit' ? '+ ' : '- '}
                    {parseFloat(tx.amount).toFixed(8)} BSV
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tx.description}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(tx)}>
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="beefId" className="text-right">
                            Beef ID
                          </Label>
                          <Input
                            id="beefId"
                            value={selectedTransaction?.beefTx || ''}
                            className="col-span-3"
                            readOnly
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="txId" className="text-right">
                            Transaction ID
                          </Label>
                          <Input
                            id="txId"
                            value={selectedTransaction?.id || ''}
                            className="col-span-3"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedTransaction?.beefTx || '')}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Beef ID
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedTransaction?.id || '')}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Transaction ID
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTreasury;