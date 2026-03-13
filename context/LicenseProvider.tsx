import React from 'react'
import { nftLicenseTokenAddress } from 'contracts/address'
import { useSetRecoilState } from 'recoil'
import { licenseNftStore, ownedLicenseNftStore } from 'store/licenseNFT.atom'
import { sepolia } from 'thirdweb/chains'
import { twClient } from 'components/CustomWeb3Provider'
import { getContract } from 'thirdweb'
import useNFTs from 'hooks/useNFTs'
import useOwnedNfts from 'hooks/useOwnedNFTs'

interface Props {
  children: JSX.Element
}

export const LicenseProvider = ({ children }: Props) => {
  const contract = getContract({ address: nftLicenseTokenAddress, chain: sepolia, client: twClient })
  const { data: licenses } = useNFTs(contract.address)
  const { data: ownedLicenses } = useOwnedNfts(contract.address)
  const setLicenseNFTs = useSetRecoilState(licenseNftStore)
  const setOwnedLicenseNftStore = useSetRecoilState(ownedLicenseNftStore)
  console.log({ ownedLicenses, licenses })

  React.useEffect(() => {
    setLicenseNFTs(licenses)
  }, [licenses, setLicenseNFTs])

  React.useEffect(() => {
    setOwnedLicenseNftStore(ownedLicenses)
  }, [ownedLicenses, setOwnedLicenseNftStore])

  return children
}
