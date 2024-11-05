import { PrivateKey } from '@bsv/sdk';
import { PrismaClient } from '@/prisma/generated/client';

const prisma = new PrismaClient();

export const generateWallet = async () => {
  try {
    const privateKey = PrivateKey.fromRandom();
    const wif = privateKey.toWif();
    const publicKey = privateKey.toPublicKey();
    const testnetAddress = publicKey.toAddress([0x6f]).toString();

    const newWallet = await prisma.wallet.create({
      data: {
        address: testnetAddress,
        privateKey: wif,
        createdAt: new Date()
      }
    });

    return {
      testnetAddress,
      walletId: newWallet.id
    };
  } catch (error) {
    console.error('Failed to generate and store wallet:', error);
    throw new Error(
      `Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    await prisma.$disconnect();
  }
};
