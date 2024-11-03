"use client"

import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DepositTransaction } from 'app/api/deposit-history/route';

export function DepositHistoryTable({ depositHistory }: { depositHistory: DepositTransaction[] }) {
  return (
    <div className="w-full">
      <div className="md:hidden space-y-4">
        {depositHistory.map((transaction, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader className="bg-muted py-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {format(new Date(transaction.date), 'PPP p')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Txid:</span>
                  <span className="font-mono truncate">{transaction.txid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Beef TX:</span>
                  <span className="font-mono truncate">{transaction.beefTx}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Vout:</span>
                  <span>{transaction.vout}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">TX Type:</span>
                  <span>{transaction.txType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Amount (BSV):</span>
                  <span className="text-right font-medium">{(transaction.amount / 100000000).toFixed(8)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:block">
        <Card className="shadow-md">
          <CardHeader className="bg-muted py-4">
            <CardTitle>Deposit History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead>Txid</TableHead>
                    <TableHead>Beef TX</TableHead>
                    <TableHead className="w-[80px] text-right">Vout</TableHead>
                    <TableHead className="w-[100px]">TX Type</TableHead>
                    <TableHead className="w-[150px] text-right">Amount (BSV)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositHistory.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{format(new Date(transaction.date), 'PPP p')}</TableCell>
                      <TableCell className="font-mono max-w-[150px] truncate" title={transaction.txid}>
                        {transaction.txid}
                      </TableCell>
                      <TableCell className="font-mono max-w-[150px] truncate" title={transaction.beefTx}>
                        {transaction.beefTx}
                      </TableCell>
                      <TableCell className="text-right">{transaction.vout}</TableCell>
                      <TableCell>{transaction.txType}</TableCell>
                      <TableCell className="text-right font-medium">
                        {(transaction.amount / 100000000).toFixed(8)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}