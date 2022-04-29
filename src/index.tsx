import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Config, DAppProvider, Mainnet } from '@usedapp/core';

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: 'https://main-light.eth.linkpool.io',
  },
  networks: [Mainnet]
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);
