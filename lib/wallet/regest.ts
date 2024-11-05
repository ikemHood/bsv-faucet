import axios from 'axios';

const TESTNET_API_URL = 'https://api.whatsonchain.com/v1/bsv/test';

export const getUTXOs = async (address: string) => {
  try {
    const response = await axios.get(`${TESTNET_API_URL}/address/${address}/unspent`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching UTXOs: ${error}`);
  }
};

export const broadcastTransaction = async (rawTx: string) => {
  try {
    const response = await axios.post(`${TESTNET_API_URL}/tx/raw`, { txhex: rawTx });
    return response.data;
  } catch (error) {
    throw new Error(`Error broadcasting transaction: ${error}`);
  }
};

export const getRawTransaction = async (tx_hash: string) => {
  try {
    const response = await axios.get(`${TESTNET_API_URL}/tx/${tx_hash}/hex`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching raw transaction: ${error}`);
  }
};
