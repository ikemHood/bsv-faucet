'use client';

import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Timer, Wallet, History, AlertTriangle } from 'lucide-react';
import { createAndSendTransaction } from '@/lib/wallet/transactions';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminWalletAddress } from '@/lib/utils';

interface Transaction {
  id: number;
  date: string;
  txid: string;
  amount: number;
  txType: string;
}

export default function DashboardPage() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [faucetBalance, setFaucetBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  const adminWalletAddress = AdminWalletAddress();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [balanceResponse, transactionsResponse] = await Promise.all([
          fetch('/api/wallet/balance'),
          fetch('/api/transactions')
        ]);

        if (!balanceResponse.ok || !transactionsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const balanceData = await balanceResponse.json();
        const transactionsData = await transactionsResponse.json();
        console.log(adminWalletAddress)
        setFaucetBalance(balanceData.balance);
        setTransactions(transactionsData.transactions);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load faucet data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const timeLeft = localStorage.getItem('nextRequestTime');
    if (timeLeft) {
      setRemainingTime(Math.max(0, parseInt(timeLeft) - Date.now()));
    }

    const timer = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isValidBSVAddress = (addr: string) =>
    /^[mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr);

  const validateForm = () => {
    if (!isValidBSVAddress(address)) return 'Invalid BSV testnet address';
    if (!amount || parseInt(amount) <= 0 || parseInt(amount) > 100000000)
      return 'Invalid amount (max 1 BSV / 100,000,000 satoshis)';
    if (!captchaValue) return 'Please complete the captcha';
    if (remainingTime > 0) return 'Please wait for the cooldown period to end';
    return null;
  };

  const handleRequest = async () => {
    setError('');
    setSuccess('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const amountInSatoshis = parseInt(amount);
      const privKeyWif = process.env.TREASURY_WALLET_WIF as string;

      const txid = await createAndSendTransaction(
        privKeyWif,
        address,
        amountInSatoshis,
        'testnet'
      );

      setSuccess(
        `Successfully sent ${amount} satoshis to ${address}. TxID: ${txid}`
      );

      // Refresh data after successful transaction
      const [balanceResponse, transactionsResponse] = await Promise.all([
        fetch('/api/wallet/balance'),
        fetch('/api/transactions')
      ]);

      if (balanceResponse.ok && transactionsResponse.ok) {
        const balanceData = await balanceResponse.json();
        const transactionsData = await transactionsResponse.json();
        setFaucetBalance(balanceData.balance);
        setTransactions(transactionsData.transactions);
      }

      // Set cooldown period
      const nextRequestTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('nextRequestTime', nextRequestTime.toString());
      setRemainingTime(24 * 60 * 60 * 1000);
    } catch (err: any) {
      setError(`Failed to process request: ${err.message}`);
      console.error('Transaction error:', err);
    }
  };

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value || '');
  };

  const formatTimeRemaining = (time: number) => {
    const hours = Math.floor(time / (60 * 60 * 1000));
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>BSV Testnet Faucet</CardTitle>
          <CardDescription>Request testnet BSV tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Faucet Balance:</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="font-bold">{faucetBalance} satoshis</span>
            )}
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Enter BSV testnet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount (in satoshis, max 100,000,000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max="100000000"
            />

            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={onCaptchaChange}
            />

            {remainingTime > 0 && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <Timer className="h-5 w-5" />
                <span>
                  Next request available in:{' '}
                  {formatTimeRemaining(remainingTime)}
                </span>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleRequest}
              disabled={remainingTime > 0 || isLoading}
            >
              Request BSV
            </Button>
          </div>

          {error && (
            <p className="text-red-500" role="alert">
              <AlertTriangle className="inline h-4 w-4 mr-2" />
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500" role="status">
              <History className="inline h-4 w-4 mr-2" />
              {success}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Last 5 faucet transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount (satoshis)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : transactions && transactions.length > 0 ? (
                transactions.slice(0, 5).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.txType}</TableCell>
                    <TableCell>
                      <a
                        href={`https://test.whatsonchain.com/tx/${tx.txid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        title={`View Transaction ${tx.txid}`}
                      >
                        {tx.txid.substring(0, 8)}...
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donate to Faucet</CardTitle>
          <CardDescription>
            Donate unused BSV back to the Faucet.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full flex items-center">
          <div className="p-4 rounded-lg">
            <div className="text-sm font-medium">Faucet Address</div>
            <p className="text-sm text-muted-foreground">
              Click to copy address, send unused BSV back to faucet address
            </p>
            <div
              className="text-xl text-center bg-secondary rounded-lg p-2 px-4 font-semibold"
              onClick={() => {
                navigator.clipboard.writeText(adminWalletAddress);
                toast({
                  title: 'Copied to clipboard',
                  description: `Faucet address copied to clipboard`
                });
              }}
            >
              {adminWalletAddress}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
