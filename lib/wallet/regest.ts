// src/utils/regest.ts
import axios from 'axios';

const TESTNET_API_URL = 'https://api.whatsonchain.com/v1/bsv/test';

export const getUTXOs = async (address: string) => {
  const response = await axios.get(`${TESTNET_API_URL}/address/${address}/unspent`);
  return response.data;
};

export const broadcastTransaction = async (rawTx: string) => {
  const response = await axios.post(`${TESTNET_API_URL}/tx/raw`, { txhex: rawTx });
  return response.data;
};

export const getRawTransaction = async (tx_hash: string) => {
  const response = await axios.get(`${TESTNET_API_URL}/tx/${tx_hash}/hex`);
  return response.data;
};
