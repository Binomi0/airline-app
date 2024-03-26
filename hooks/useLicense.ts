import { useContract, useNFTBalance } from '@thirdweb-dev/react'
import { nftLicenseTokenAddress } from 'contracts/address'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'

const useLicense = (id?: string) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { contract } = useContract(nftLicenseTokenAddress)
  const { data, refetch } = useNFTBalance(contract, smartAccountAddress, id)

  const hasLicense = smartAccountAddress && data ? !data.isZero() : false

  return { hasLicense, refetch }
}

export default useLicense
