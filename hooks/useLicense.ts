import { nftLicenseTokenAddress } from 'contracts/address'
import useOwnedNfts from 'hooks/useOwnedNFTs'

type UseLicenseReturnType = {
  hasLicense: boolean
}

const useLicense = (tokenId: string): UseLicenseReturnType => {
  const { data: ownedNfts } = useOwnedNfts()

  const hasLicense = ownedNfts?.some(
    (n) => n.tokenId === tokenId && n.tokenAddress.toLowerCase() === nftLicenseTokenAddress.toLowerCase()
  )

  return { hasLicense: !!hasLicense }
}

export default useLicense
