import React, { createContext, useMemo, ReactNode, useContext } from 'react'
import { getContract, ThirdwebContract } from 'thirdweb'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import {
  stakingAddress,
  nftAircraftTokenAddress,
  nftLicenseTokenAddress,
  coinTokenAddress,
  rewardTokenAddress,
  factoryAddress,
  flightNftAddress
} from 'contracts/address'

interface ContractContextType {
  stakingContract: ThirdwebContract | undefined
  aircraftContract: ThirdwebContract | undefined
  licenseContract: ThirdwebContract | undefined
  coinContract: ThirdwebContract | undefined
  rewardContract: ThirdwebContract | undefined
  factoryContract: ThirdwebContract | undefined
  flightContract: ThirdwebContract | undefined
}

export const ContractContext = createContext<ContractContextType>({
  stakingContract: undefined,
  aircraftContract: undefined,
  licenseContract: undefined,
  coinContract: undefined,
  rewardContract: undefined,
  factoryContract: undefined,
  flightContract: undefined
})

interface Props {
  children: ReactNode
}

export const ContractProvider = ({ children }: Props) => {
  const { twClient: client, twChain: chain } = useRecoilValue(walletStore)

  const contracts = useMemo(() => {
    if (!client || !chain) {
      return {
        stakingContract: undefined,
        aircraftContract: undefined,
        licenseContract: undefined,
        coinContract: undefined,
        rewardContract: undefined,
        factoryContract: undefined,
        flightContract: undefined
      }
    }

    const getCustomContract = (address: string) => getContract({ client, chain, address })

    return {
      stakingContract: getCustomContract(stakingAddress),
      aircraftContract: getCustomContract(nftAircraftTokenAddress),
      licenseContract: getCustomContract(nftLicenseTokenAddress),
      coinContract: getCustomContract(coinTokenAddress),
      rewardContract: getCustomContract(rewardTokenAddress),
      factoryContract: getCustomContract(factoryAddress),
      flightContract: getCustomContract(flightNftAddress)
    }
  }, [client, chain])

  return <ContractContext.Provider value={contracts}>{children}</ContractContext.Provider>
}

export const useContractProviderContext = () => useContext(ContractContext)
