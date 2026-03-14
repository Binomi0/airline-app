import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { licenseNftStore, ownedLicenseNftStore } from 'store/licenseNFT.atom'
import { fetcher } from 'utils'
import useSWR from 'swr'
import { useAppContracts } from 'hooks/useAppContracts'
import { walletStore } from 'store/wallet.atom'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import { Hex } from 'thirdweb'

interface Props {
  children: JSX.Element
}

export const LicenseProvider = ({ children }: Props) => {
  const { data: nfts, mutate } = useSWR<any[]>('/api/nft', fetcher)
  const setLicenseNFTs = useSetRecoilState(licenseNftStore)
  const setOwnedLicenseNftStore = useSetRecoilState(ownedLicenseNftStore)
  const { licenseContract } = useAppContracts()
  const { data: ownedNfts } = useOwnedNfts(licenseContract?.address as Hex)

  const licenseList = React.useMemo(() => {
    if (!nfts) return []
    return nfts.filter(
      (nft: any) => nft.tokenAddress.toLowerCase() === (licenseContract?.address || '').toLowerCase()
    )
  }, [nfts, licenseContract])

  React.useEffect(() => {
    setLicenseNFTs(licenseList)
  }, [licenseList, setLicenseNFTs])

  React.useEffect(() => {
    if (ownedNfts) {
      setOwnedLicenseNftStore(ownedNfts)
    }
  }, [ownedNfts, setOwnedLicenseNftStore])

  return children
}
