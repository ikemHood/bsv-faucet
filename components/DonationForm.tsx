'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //TODO: replace dummy address with faucet address
  const address = '0x1234567890123456789012345678901234567890';

  //TODO: Implement wallet logic
  const [balance, setBalance] = useState(1000);
  const [isConnected, setIsConnected] = useState(false);

  function handleDonate(e: React.FormEvent) {
    if (!isConnected) {
      handleConnectWallet();
    }
    e.preventDefault();
    console.log('Form submitted');
  }

  function handleConnectWallet() {
    //TODO: perform connection logic
    setIsConnected(true);
  }

  function handleSelectPercentage(percentage: number) {
    const calculatedAmount = (balance * percentage / 100).toFixed(2);
    setAmount(calculatedAmount);
  }

  return (
    <div className="">
      <p className="text-md text-muted-foreground font-bold p-2">Donation to Fuacet</p>
      <p className="text-sm text-muted-foreground p-2">
        Fuacet address: <address>{address}</address>
      </p>

      <Card className="w-full max-w-sm">
        <CardContent>
          <form onSubmit={handleDonate} className="w-full space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="amount" className="block text-sm font-medium">
                  Amount
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPercentage(25)}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    25%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPercentage(50)}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPercentage(100)}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Max
                  </button>
                </div>
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  id="amount"
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                {isConnected && (
                  <div className="absolute right-0 -bottom-6 text-xs text-gray-500">
                    Balance: {balance.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {isConnected ? loading ? 'Donating...' : 'Donate' : 'Connect Wallet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}