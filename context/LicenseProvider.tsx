import React from 'react'
import { useSetRecoilState } from 'recoil'
import { licenseNftStore, ownedLicenseNftStore } from 'store/licenseNFT.atom'
import { fetcher } from 'utils'
import useSWR from 'swr'
import { useAppContracts } from 'hooks/useAppContracts'

interface Props {
  children: JSX.Element
}

export const LicenseProvider = ({ children }: Props) => {
  const { data: nfts } = useSWR<any[]>('/api/nft', fetcher)
  const setLicenseNFTs = useSetRecoilState(licenseNftStore)
  const setOwnedLicenseNftStore = useSetRecoilState(ownedLicenseNftStore)
  const { licenseContract } = useAppContracts()

  const licenseList = React.useMemo(() => {
    if (!nfts) return []
    return nfts.filter(
      (nft: any) => nft.tokenAddress.toLowerCase() === (licenseContract?.address || '').toLowerCase()
    )
  }, [nfts, licenseContract])

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
