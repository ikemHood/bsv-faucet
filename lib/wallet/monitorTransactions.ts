import cron from 'node-cron';
import { getUTXOs, getRawTransaction } from './regest';
import { PrismaClient } from '@prisma/client';
import { PrivateKey } from '@bsv/sdk';

const prisma = new PrismaClient();

const start = async () => {
  const wallet = await prisma.wallet.findFirst();
  if (!wallet) throw new Error("Wallet not found");

  const treasuryWIF = process.env.TREASURY_WALLET_WIF as string;
  const privateKey = PrivateKey.fromWif(wallet.privateKey);
  const treasuryAddress = privateKey.toAddress("testnet").toString();

  const monitorIncomingTransactions = async () => {
    try {
      const utxos = await getUTXOs(treasuryAddress);
      for (const utxo of utxos) {
        const existingTransaction = await prisma.transaction.findUnique({
          where: { txid: utxo.tx_hash },
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
                value: utxo.value,
              },
              vout: [
                {
                  address: treasuryAddress,
                  satoshis: utxo.value,
                },
              ],
              txType: "incoming",
              spentStatus: false,
              testnetFlag: true,
              amount: BigInt(utxo.value),
            },
          });
          console.log(`New incoming transaction recorded: ${utxo.tx_hash}`);
        }
      }
    } catch (error) {
      console.error("Error monitoring incoming transactions:", error);
    }
  };

  cron.schedule('* * * * *', monitorIncomingTransactions);
};

start().catch(error => console.error("Error starting the monitor:", error));
