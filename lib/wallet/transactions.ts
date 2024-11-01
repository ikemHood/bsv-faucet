import { PrivateKey, P2PKH, Transaction } from '@bsv/sdk';
import { getUTXOs, getRawTransaction, broadcastTransaction } from './regest';

export const createAndSendTransaction = async (privKeyWif: string, toAddress: string, amount: number) => {
  const privateKey = PrivateKey.fromWif(privKeyWif);
  const address = privateKey.toAddress("testnet").toString();

  const utxos = await getUTXOs(address);

  if (!utxos.length || !utxos[0].tx_hash) {
    throw new Error('No valid UTXOs available for the address.');
  }

  const selectedUTXO = utxos[0];

  let rawTransactionHex;
  try {
    rawTransactionHex = await getRawTransaction(selectedUTXO.tx_hash);
  } catch (error) {
    throw new Error(`Failed to fetch raw transaction data: ${error}`);
  }

  let sourceTransaction;
  try {
    sourceTransaction = Transaction.fromHex(rawTransactionHex);
  } catch (error) {
    throw new Error(`Failed to create transaction from raw transaction hex: ${error}`);
  }

  const input = {
    sourceTransaction,
    sourceOutputIndex: selectedUTXO.tx_pos,
    unlockingScriptTemplate: new P2PKH().unlock(privateKey),
  };

  const output = {
    lockingScript: new P2PKH().lock(privateKey.toPublicKey().toHash()),
    satoshis: amount,
    change: true,
  };

  const tx = new Transaction(1, [input], [output]);
  try {
    await tx.fee();
    await tx.sign();
  } catch (signError) {
    throw new Error(`Failed to sign transaction: ${signError}`);
  }

  const rawTx = tx.toHex();

  try {
    const txid = await broadcastTransaction(rawTx);
    console.log({txid})
    return txid;
  } catch (broadcastError) {
    throw new Error(`Failed to broadcast transaction: ${broadcastError}`);
  }
};
