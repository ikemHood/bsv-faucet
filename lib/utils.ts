import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const AdminWalletAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS || 'mgqipciCS56nCYSjB1vTcDGskN82yxfo1G';
