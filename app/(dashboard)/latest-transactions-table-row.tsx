import { User, TransactionWithUser } from '@/lib/prisma';
import { TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const LatestTransactionsTableRow = ({
  user,
  transaction
}: {
  user: User;
  transaction: TransactionWithUser;
}) => (
  <TableRow>
    <TableCell className="max-w-40 truncate">
      <a
        href={`https://test.whatsonchain.com/tx/${transaction.txid}`}
        className="text-blue-500 hover:brightness-150"
        target="_blank"
        rel="noopener noreferrer"
      >
        {transaction.txid}
      </a>
    </TableCell>
    <TableCell suppressHydrationWarning>
      {transaction.date.toLocaleString()}
    </TableCell>
    {user.role === 'admin' && (
      <TableCell>
        {transaction.user && (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={transaction.user?.imageUrl} />
              <AvatarFallback>{transaction.user.username}</AvatarFallback>
            </Avatar>
            <div className="flex justify-start flex-col">
              <span>{transaction.user.username}</span>
              <span>{transaction.user.email}</span>
            </div>
          </div>
        )}
      </TableCell>
    )}
    <TableCell className="max-w-40 truncate">
      <a
        href={`https://test.whatsonchain.com/tx/${transaction.beefTx.txid}`}
        className="text-blue-500 hover:brightness-150"
        target="_blank"
        rel="noopener noreferrer"
      >
        {transaction.beefTx.txid}
      </a>
    </TableCell>
    <TableCell>{transaction.txType}</TableCell>
    <TableCell>{transaction.amount.toString()}</TableCell>
    <TableCell>{transaction.spentStatus ? 'Spent' : 'Unspent'}</TableCell>
  </TableRow>
);

export default LatestTransactionsTableRow;
