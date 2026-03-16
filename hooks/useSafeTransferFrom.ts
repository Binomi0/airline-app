import { SmartContract } from '@thirdweb-dev/sdk'
import { nftLicenseTokenAddress } from 'contracts/address'
import { BaseContract, ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { paymasterSignerStore, smartAccountSignerStore } from 'store/wallet.atom'
import { Hex } from 'types'

const useSafeTransferFrom = (contract: SmartContract<BaseContract>) => {
  const [loading, setLoading] = useState(false)
  // const smartSigner = useRecoilValue(smartAccountSignerStore)
  const paymasterSigner = useRecoilValue(paymasterSignerStore)

  const safeTransferFrom = useCallback(async () => {
    if (!paymasterSigner) return
    setLoading(true)

    const erc1155Contract = new ethers.Contract(nftLicenseTokenAddress, contract.abi)
    const encodedCallData = erc1155Contract.interface.encodeFunctionData('safeTransferFrom', [
      '0xA832BC0b75161E5f69cBd66970b8df7eCE846e47', // FROM
      '0x98CDf5F4D4D7f5b97F84c82fC44F591a239290e4', // TO
      0, // TOKEN ID
      1, // QUANTITY
      '0x' // DATA
    ])

    const { hash } = await paymasterSigner.sendUserOperation({
      target: nftLicenseTokenAddress,
      data: encodedCallData as Hex
    })

    await paymasterSigner.waitForUserOperationTransaction(hash as Hex)

    setLoading(false)
  }, [contract.abi, paymasterSigner])

  return {
    safeTransferFrom,
    loading
  }
}

export default useSafeTransferFrom
