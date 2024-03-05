import { useContract, useNFTBalance } from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { nftLicenseTokenAddress } from 'contracts/address'

const useLicense = (id?: string) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { contract } = useContract(nftLicenseTokenAddress)
  const { data, refetch } = useNFTBalance(contract, smartAccountAddress, id)

  const hasLicense = smartAccountAddress && data ? !data.isZero() : false

  return { hasLicense, refetch }
}

export default useLicense
