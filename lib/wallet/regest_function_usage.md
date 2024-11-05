
# Function Descriptions for lib/wallet/regest.ts

## 1. getUTXOs

Fetch unspent transaction outputs for a specific address.

### Syntax

```javascript
getUTXOs(address: string, network?: 'testnet' | 'mainnet'): Promise<any>
```

### Parameters

-   **address**: The Bitcoin SV address for which to fetch UTXOs (string).
-   **network**: The network to use ('testnet' or 'mainnet'). Defaults to 'testnet'.

### Returns

A promise that resolves to the UTXOs data.

### Example

```javascript
const utxos = await getUTXOs('bsv-address', 'mainnet');
console.log(utxos);`
```
2\. broadcastTransaction
------------------------

Broadcast a raw transaction to the specified network.

### Syntax

```javascript
broadcastTransaction(rawTx: string, network?: 'testnet' | 'mainnet'): Promise<any>`
```
### Parameters

-   **rawTx**
-   **network**: The network to use ('testnet' or 'mainnet'). Defaults to 'testnet'.


3\. getRawTransaction
---------------------

Retrieve raw transaction data by transaction hash.

### Syntax

```javascript
getRawTransaction(tx_hash: string, network?: 'testnet' | 'mainnet'): Promise<any>`
```

### Parameters

-   **tx_hash**: The transaction hash for which to retrieve the raw transaction data (string).
-   **network**: The network to use ('testnet' or 'mainnet'). Defaults to 'testnet'.

### Returns

A promise that resolves to the raw transaction data.

### Example

```javascript
const rawTransaction = await getRawTransaction('your-tx-hash', 'mainnet');
console.log(rawTransaction);
```