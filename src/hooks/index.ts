import { useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import { utils } from 'ethers';
import { ICEthStrategy, AaveLendingPoolV2, LidoOracle } from '../../gen/types';
import ICEthAbi from '../abi/ICEthStrategy.json';
import AaveAbi from '../abi/AaveLendingPoolV2.json';
import LidoAbi from '../abi/LidoOracle.json';

const ICETH_STRATEGY_ADDRESS = '0xe6484a64e2ea165943c734dC498070b5902CBc2b';
const icEthInterface = new utils.Interface(ICEthAbi);
const icEthContract = new Contract(ICETH_STRATEGY_ADDRESS, icEthInterface) as ICEthStrategy;

const AAVE_LENDING_POOL_ADDRESS = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const aaveInterface = new utils.Interface(AaveAbi);
const aaveContract = new Contract(AAVE_LENDING_POOL_ADDRESS, aaveInterface) as AaveLendingPoolV2;

const LIDO_ORACLE_ADDRESS = '0x442af784A788A5bd6F42A01Ebe9F287a871243fb';
const lidoOracleInterface = new utils.Interface(LidoAbi);
const lidoOracleContract = new Contract(LIDO_ORACLE_ADDRESS, lidoOracleInterface) as LidoOracle;

const useGetLeverageRatio = (): number => {
  const { value } =
    useCall({
      contract: icEthContract,
      method: 'getCurrentLeverageRatio',
      args: [],
    }) ?? {};

  return Number(value?.[0].toBigInt());
};

const useGetReserveData = (address: string) => {
  const { value } =
    useCall({
      contract: aaveContract,
      method: 'getReserveData',
      args: [address],
    }) ?? {};

  return value?.[0].currentVariableBorrowRate;
};
const useGetLastCompletedReportDelta = () => {
  const { value } =
    useCall({
      contract: lidoOracleContract,
      method: 'getLastCompletedReportDelta',
      args: [],
    }) ?? {};

  return {
    postTotalPooledEther: Number(value?.[0].toBigInt()),
    preTotalPooledEther: Number(value?.[1].toBigInt()),
    timeElapsed: Number(value?.[2].toBigInt()),
  };
};

export { useGetLeverageRatio, useGetReserveData, useGetLastCompletedReportDelta };
