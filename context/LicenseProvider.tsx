import React from 'react'
import { nftLicenseTokenAddress } from 'contracts/address'
import { useSetRecoilState } from 'recoil'
import { licenseNftStore, ownedLicenseNftStore } from 'store/licenseNFT.atom'
import { fetcher } from 'utils'
import useSWR from 'swr'

interface Props {
  children: JSX.Element
}

export const LicenseProvider = ({ children }: Props) => {
  const { data: nfts } = useSWR<any[]>('/api/nft', fetcher)
  const setLicenseNFTs = useSetRecoilState(licenseNftStore)
  const setOwnedLicenseNftStore = useSetRecoilState(ownedLicenseNftStore)

  const licenseList = React.useMemo(() => {
    if (!nfts) return []
    return nfts.filter(
      (nft: any) => nft.tokenAddress.toLowerCase() === nftLicenseTokenAddress.toLowerCase()
    )
  }, [nfts])

  const ownedList = React.useMemo(() => {
    return licenseList.filter((nft: any) => nft.owner !== null)
  }, [licenseList])

  React.useEffect(() => {
    setLicenseNFTs(licenseList)
  }, [licenseList, setLicenseNFTs])

  React.useEffect(() => {
    setOwnedLicenseNftStore(ownedList)
  }, [ownedList, setOwnedLicenseNftStore])

  return children
}
