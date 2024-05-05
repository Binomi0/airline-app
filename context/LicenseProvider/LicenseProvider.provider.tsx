import React, { useCallback, useEffect, useState, type FC } from 'react'
import { LicenseProviderContext } from './LicenseProvider.context'
import { LicenseReducerState } from './LicenseProvider.types'
import { nftLicenseTokenAddress } from 'contracts/address'
import { NFT } from '@thirdweb-dev/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { getApi } from 'lib/api'
import { nftLicenseStore, ownedNftLicenseStore } from 'store/nft.licenses.atom'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { publicClient } from 'lib/clientWallet'
import LicenseNftJson from 'contracts/abi/LicenseNFT.json'

const getLicenseMetadata = async (id: number) => {
  const license = await getApi<NFT>(`/api/metadata/license/${id}`)
  if (!license) {
    throw new Error('While getting license metadata')
  }

  const nft: NFT = {
    type: 'ERC1155',
    supply: '100',
    metadata: license.metadata,
    owner: '0x0000000000000000000000000000000000000000'
  }

  return nft
}

export const INITIAL_STATE: LicenseReducerState = {
  ownedLicenses: [],
  licenses: [],
  isLoading: false
}

export const LicenseProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const [licenses, setLicenseNfts] = useRecoilState(nftLicenseStore)
  const [owned, setOwnedLicenseNfts] = useRecoilState(ownedNftLicenseStore)
  const [isLoading, setIsLoading] = useState(true)
  const { Provider } = LicenseProviderContext

  const getOwnedLicenses = useCallback(
    async (address: string) => {
      try {
        const balances = (await publicClient.readContract({
          abi: LicenseNftJson.abi,
          address: nftLicenseTokenAddress,
          functionName: 'balanceOfBatch',
          args: [
            [address, address, address, address],
            [0, 1, 2, 3]
          ]
        })) as bigint[]

        console.log({ balances })

        const _owned: NFT[] = balances.filter((balance) => balance === BigInt(1)).map((_, i) => licenses[i])
        setOwnedLicenseNfts(_owned)
      } catch (error) {
        console.log('User does not have this license.')
        console.error('GET OWNED LICENSE ERROR =>', error)
      }
    },
    [licenses, setOwnedLicenseNfts]
  )

  const getLicenses = useCallback(async () => {
    const nfts = await Promise.all([0, 1, 2, 3].map(getLicenseMetadata))

    setLicenseNfts(nfts)
    setIsLoading(false)
  }, [setLicenseNfts])

  useEffect(() => {
    if (!smartAccountAddress) return
    getOwnedLicenses(smartAccountAddress)
  }, [smartAccountAddress, getOwnedLicenses])

  useEffect(() => {
    getLicenses()
  }, [getLicenses])

  return (
    <Provider value={{ ownedLicenses: owned, licenses, isLoading, refetchLicenses: getOwnedLicenses }}>
      {children}
    </Provider>
  )
}
