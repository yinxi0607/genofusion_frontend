// src/global.d.ts
import { EthereumProvider } from 'ethereum-protocol';

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}
