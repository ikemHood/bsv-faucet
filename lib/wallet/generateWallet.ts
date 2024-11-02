import { PrivateKey } from '@bsv/sdk';
import { db, wallets } from '../db';

export const generateWallet = async () => {
  try {
    const privateKey = PrivateKey.fromRandom();
    const wif = privateKey.toWif();
    const publicKey = privateKey.toPublicKey();
    const testnetAddress = publicKey.toAddress([0x6f]).toString();

    const [newWallet] = await db
      .insert(wallets)
      .values({
        address: testnetAddress,
        privateKey: wif,
        balance: '0',
        createdAt: new Date(),
        lastUpdated: new Date()
      })
      .returning();

    return {
      testnetAddress,
      walletId: newWallet.id
    };
  } catch (error) {
    console.error('Failed to generate and store wallet:', error);
    throw new Error(`Failed to create wallet: ${error}`);
  }
};
