import { PrivateKey } from '@bsv/sdk';

export const generateWallet = () => {
  const privateKey = PrivateKey.fromRandom();
  
  const wif = privateKey.toWif();
  
  const publicKey = privateKey.toPublicKey();

  const testnetAddress = publicKey.toAddress([0x6f]).toString();

  return {wif, testnetAddress}
}
