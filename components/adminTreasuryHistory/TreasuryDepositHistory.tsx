"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useWalletMonitor from '@/hooks/useWalletMonitor'




interface Transaction {
  id: number
  txid: string
  beefTx: {
    txid: string
    vout: number
    value: number
  }
  vout: Array<{
    address: string
    satoshis: number
  }>
  txType: 'deposit'
  amount: string
  date: string
}

export default function TreasuryDepositHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useWalletMonitor()



  useEffect(() => {
    const fetchTransactions = async () => {
      
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/transactions')
        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }
        const data: Transaction[] = await response.json()
        setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching transactions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatAmount = (amount: string) => {
    return (parseInt(amount) / 100000000).toFixed(8)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Treasury - Deposit History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="font-medium">
                  + {formatAmount(tx.amount)} BSV
                </div>
                <div className="text-sm text-muted-foreground">
                  Txid: {tx.txid.substring(0, 8)}... | Beef TX: {tx.beefTx.txid.substring(0, 8)}...
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {formatDate(tx.date)}
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
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Input
                          id="date"
                          value={selectedTransaction ? formatDate(selectedTransaction.date) : ''}
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="txid" className="text-right">
                          Txid
                        </Label>
                        <Input
                          id="txid"
                          value={selectedTransaction?.txid || ''}
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="beefTx" className="text-right">
                          Beef TX
                        </Label>
                        <Input
                          id="beefTx"
                          value={selectedTransaction?.beefTx.txid || ''}
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vout" className="text-right">
                          Vout
                        </Label>
                        <Input
                          id="vout"
                          value={selectedTransaction?.beefTx.vout.toString() || ''}
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="txType" className="text-right">
                          TX Type
                        </Label>
                        <Input
                          id="txType"
                          value={selectedTransaction?.txType || ''}
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount
                        </Label>
                        <Input
                          id="amount"
                          value={selectedTransaction ? formatAmount(selectedTransaction.amount) + ' BSV' : ''}
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTransaction?.txid || '')}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Txid
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTransaction?.beefTx.txid || '')}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Beef TX
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
  )
}