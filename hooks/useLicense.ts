import { useContract, useNFTBalance } from '@thirdweb-dev/react'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { nftLicenseTokenAddress } from 'contracts/address'

const useLicense = (id?: string) => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { contract } = useContract(nftLicenseTokenAddress)
  const { data, refetch } = useNFTBalance(contract, smartAccountAddress, id)

  return { hasLicense: smartAccountAddress ? !data?.isZero() : false, refetch }
}

export default useLicense
