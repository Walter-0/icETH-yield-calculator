import { useTokenBalance, useEthers } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';

import './App.css';
import { useGetLastCompletedReportDelta, useGetLeverageRatio, useGetReserveData } from './hooks';

const ICETH_TOKEN_CONTRACT = '0x7c07f7abe10ce8e33dc6c5ad68fe033085256a84';
const WETH_TOKEN_CONTRACT = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const RAY_DECIMALS = 10 ** 27;
const WEI_DECIMALS = 10 ** 18;
const SECONDS_IN_A_YEAR = 60 * 60 * 24 * 365;

function App() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const icethBalance = useTokenBalance(ICETH_TOKEN_CONTRACT, account);
  const isConnected = account !== undefined;
  const currentLeverageRatio = useGetLeverageRatio() / WEI_DECIMALS;
  const { postTotalPooledEther, preTotalPooledEther, timeElapsed } = useGetLastCompletedReportDelta();
  const stETHYield = (((postTotalPooledEther - preTotalPooledEther) * SECONDS_IN_A_YEAR) / (preTotalPooledEther * timeElapsed));
  const aWETHBorrowRate = (useGetReserveData(WETH_TOKEN_CONTRACT) / RAY_DECIMALS);

  const grossYield = (((stETHYield - aWETHBorrowRate) * (currentLeverageRatio - 1)) + stETHYield) * 100;

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {isConnected ? (
            <button onClick={deactivate}>Disconnect</button>
          ) : (
            <button onClick={() => activateBrowserWallet()}>Connect</button>
          )}
          {account && <p>Account: {account}</p>}
          {icethBalance && <p>Balance: {formatEther(icethBalance)}</p>}
          {grossYield && <p>Gross Yield: {grossYield}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
