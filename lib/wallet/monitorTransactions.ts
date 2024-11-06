import cron from 'node-cron';
import { getUTXOs, getRawTransaction } from './regest'; // Make sure these functions are correctly implemented
import { PrismaClient } from '@/prisma/generated/client';
import { PrivateKey } from '@bsv/sdk';

const prisma = new PrismaClient();

const startTransactionMonitor = async () => {
  const treasuryWIF = process.env.TREASURY_WALLET_WIF as string;
  const privateKey = PrivateKey.fromWif(treasuryWIF);
  const treasuryAddress = privateKey.toAddress('testnet').toString();

  const monitorIncomingTransactions = async () => {
    try {
      const utxos = await getUTXOs(treasuryAddress);
      for (const utxo of utxos) {
        const existingTransaction = await prisma.transaction.findUnique({
          where: { txid: utxo.tx_hash }
        });
        if (!existingTransaction) {
          const rawTx = await getRawTransaction(utxo.tx_hash);
          await prisma.transaction.create({
            data: {
              txid: utxo.tx_hash,
              date: new Date(),
              rawTx: rawTx,
              beefTx: {
                txid: utxo.tx_hash,
                vout: utxo.tx_pos,
                value: utxo.value
              },
              vout: [
                {
                  address: treasuryAddress,
                  satoshis: utxo.value
                }
              ],
              txType: 'deposit',
              spentStatus: false,
              testnetFlag: true,
              amount: BigInt(utxo.value)
            }
          });
          console.log(`New incoming transaction recorded: ${utxo.tx_hash}`);
        }
      }
    } catch (error) {
      console.error('Error monitoring incoming transactions:', error);
    }
  };
  monitorIncomingTransactions();
  cron.schedule('* * * * *', monitorIncomingTransactions);
};

export const startMonitor = async () => {
  await startTransactionMonitor().catch((error) =>
    console.error('Error starting the monitor:', error)
  );
};
