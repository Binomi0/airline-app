import { Contract, ethers } from 'ethers'
import { bundlerActions } from 'permissionless'
import { hardhat } from 'viem/chains'
import { createPublicClient, http } from 'viem'

import AirlineCoinJSON from 'contracts/abi/AirlineCoin.json'
import BaseAccountJSON from 'contracts/abi/BaseAccount.json'
import StakingJSON from 'contracts/abi/StakingAirline.json'
import PaymasterJSON from 'contracts/abi/Paymaster.json'
import {
  ACCOUNT_ADDR,
  COIN_ADDR,
  EP_ADDR,
  PM_ADDR,
  STAKING_ADDR,
  nftLicenseTokenAddress
} from 'contracts/address/local'
import { BaseAccount } from 'typechain-types'
import { getContract } from 'viem'
import LicenseNftJson from 'contracts/abi/LicenseNFT.json'
import EntryPointJSON from '@account-abstraction/contracts/artifacts/EntryPoint.json'
import { EntryPoint } from 'permissionless/_types/types'
import { localhost } from '@wagmi/chains'

export const provider = new ethers.providers.JsonRpcProvider({
  url: 'http://localhost:3001/rpc'
})

export const aaSigner = provider.getSigner()
export const otherAccount = provider.getSigner('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
export const entryPoint = new Contract(EP_ADDR, EntryPointJSON.abi, aaSigner) as unknown as EntryPoint
export const baseAccount = new Contract(ACCOUNT_ADDR, BaseAccountJSON.abi, aaSigner) as BaseAccount

const actions = bundlerActions(EP_ADDR)
export const publicBundlerClient = createPublicClient({
  batch: {
    multicall: true
  },
  chain: localhost,
  transport: http('http://localhost:3001/rpc') // use your RPC provider or bundler
}).extend(actions)

export const airlineCoin = new Contract(COIN_ADDR, AirlineCoinJSON.abi, aaSigner)
export const staking = new Contract(STAKING_ADDR, StakingJSON.abi, aaSigner)

export const publicClient = createPublicClient({
  batch: {
    multicall: true
  },
  chain: localhost,
  transport: http('http://localhost:8545') // use your RPC provider or bundler
})

export const airlineContract = getContract({
  address: COIN_ADDR,
  abi: AirlineCoinJSON.abi,
  client: publicBundlerClient
})

// 1. Create contract instance
export const licenseNft = getContract({
  address: nftLicenseTokenAddress,
  abi: LicenseNftJson.abi,
  // 1a. Insert a single client
  client: publicClient
})

export const paymaster = getContract({
  address: PM_ADDR,
  abi: PaymasterJSON.abi,
  // 1a. Insert a single client
  client: publicClient
})

export const getGasLimits = (functionName: string) => {
  switch (functionName) {
    case 'execute':
      return 30_000

    default:
      return 20_000
  }
}
