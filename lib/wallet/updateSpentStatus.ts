import { PrismaClient } from '@/prisma/generated/client';
import { getUTXOs } from '../wallet/regest';
import cron from 'node-cron';

const prisma = new PrismaClient();

const startSpentStatusMonitor = async () => {
  const updateSpentStatus = async () => {
    try {
      console.log('Starting spent status update process...');

      const unspentTransactions = await prisma.transaction.findMany({
        where: { spentStatus: false },
        select: { id: true, txid: true, vout: true }
      });

      for (const transaction of unspentTransactions) {
        if (transaction.vout && Array.isArray(transaction.vout)) {
          const transactionUpdated = await checkAndUpdateTransactionStatus({
            ...transaction,
            vout: transaction.vout as any[], 
          });
          if (transactionUpdated) {
            console.log(`Marked transaction ${transaction.txid} as spent`);
          }
        } else {
          console.warn(`Skipping transaction ${transaction.txid}: 'vout' is not an array`);
        }
      }

      console.log('Finished updating spent status');
    } catch (error) {
      console.error('Error updating spent status:', error);
    }
  };

  cron.schedule('0 * * * *', updateSpentStatus);
  await updateSpentStatus(); 
};

const checkAndUpdateTransactionStatus = async (transaction: { id: number; txid: string; vout: any[] }) => {
  try {
    for (const [index, output] of Array.from(transaction.vout.entries())) {
      const utxos = await getUTXOs(output.address);
      const isUnspent = utxos.some(
        (utxo: { tx_hash: any; tx_pos: any }) =>
          utxo.tx_hash === transaction.txid && utxo.tx_pos === index
      );

      if (!isUnspent) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { spentStatus: true }
        });
        return true;
      }
    }
  } catch (error) {
    console.error(`Error updating transaction ${transaction.txid}:`, error);
  }
  return false; 
};

export const startSpentMonitor = async () => {
  try {
    await startSpentStatusMonitor();
  } catch (error) {
    console.error('Error starting the spent status monitor:', error);
  }
};
