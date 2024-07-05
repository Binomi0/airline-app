import React from 'react'
import { nftLicenseTokenAddress } from 'contracts/address'
import { useContract, useNFTs, useOwnedNFTs } from '@thirdweb-dev/react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from 'store/user.atom'
import { licenseNftStore, ownedLicenseNftStore } from 'store/licenseNFT.atom'

interface Props {
  children: JSX.Element
}

export const LicenseProvider = ({ children }: Props) => {
  const user = useRecoilValue(userState)
  const { contract } = useContract(nftLicenseTokenAddress)
  const { data: licenses } = useNFTs(contract)
  const { data: ownedLicenses } = useOwnedNFTs(contract, user?.address)
  const setLicenseNFTs = useSetRecoilState(licenseNftStore)
  const setOwnedLicenseNftStore = useSetRecoilState(ownedLicenseNftStore)

  React.useEffect(() => {
    setLicenseNFTs(licenses)
  }, [licenses, setLicenseNFTs])

  React.useEffect(() => {
    setOwnedLicenseNftStore(ownedLicenses)
  }, [ownedLicenses, setOwnedLicenseNftStore])

  return children
}
