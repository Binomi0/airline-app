import React from 'react'
import { useSetRecoilState } from 'recoil'
import { licenseNftStore, ownedLicenseNftStore } from 'store/licenseNFT.atom'
import { fetcher, filterByTokenAddress } from 'utils'
import useSWR from 'swr'
import { useAppContracts } from 'hooks/useAppContracts'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import { Hex, NFT } from 'thirdweb'

interface Props {
  children: JSX.Element
}

export const LicenseProvider = ({ children }: Props) => {
  const { data: nfts } = useSWR<NFT[]>('/api/nft', fetcher)
  const setLicenseNFTs = useSetRecoilState(licenseNftStore)
  const setOwnedLicenseNftStore = useSetRecoilState(ownedLicenseNftStore)
  const { licenseContract } = useAppContracts()
  const { data: ownedNfts } = useOwnedNfts(licenseContract?.address as Hex)

  const licenseList = React.useMemo(() => {
    if (!nfts) return []
    return nfts.filter(filterByTokenAddress(licenseContract?.address as Hex))
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
