import { Hex } from '@alchemy/aa-core'
import { SmartContract } from '@thirdweb-dev/sdk'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { nftLicenseTokenAddress } from 'contracts/address'
import { BaseContract, ethers } from 'ethers'
import { useCallback, useState } from 'react'

const useSafeTransferFrom = (contract: SmartContract<BaseContract>) => {
  const [loading, setLoading] = useState(false)
  const { smartSigner } = useAlchemyProviderContext()

  const safeTransferFrom = useCallback(async () => {
    if (!smartSigner) return
    setLoading(true)

    const erc1155Contract = new ethers.Contract(nftLicenseTokenAddress, contract.abi)
    const encodedCallData = erc1155Contract.interface.encodeFunctionData('safeTransferFrom', [
      '0xA832BC0b75161E5f69cBd66970b8df7eCE846e47', // FROM
      '0x98CDf5F4D4D7f5b97F84c82fC44F591a239290e4', // TO
      0, // TOKEN ID
      1, // QUANTITY
      '0x' // DATA
    ])

    const { hash } = await smartSigner.sendUserOperation({
      target: nftLicenseTokenAddress,
      data: encodedCallData as Hex
    })

    await smartSigner.waitForUserOperationTransaction(hash as Hex)

    setLoading(false)
  }, [contract.abi, smartSigner])

  return {
    safeTransferFrom,
    loading
  }
}

export default useSafeTransferFrom
