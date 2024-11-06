import { PrivateKey } from '@bsv/sdk';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AdminWalletAddress = () => {
  const treasuryWIF = process.env.TREASURY_WALLET_WIF as string;
  const privateKey = PrivateKey.fromWif(treasuryWIF);
  const address = privateKey.toAddress('testnet').toString();
  return address;
};