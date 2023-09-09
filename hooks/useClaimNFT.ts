import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { coinTokenAddress, nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { BaseContract, ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { NFT, SmartContract } from '@thirdweb-dev/sdk'
import { getNFTAttributes } from 'utils'
import { Hex } from '@alchemy/aa-core'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'

const erc20Contract = new ethers.Contract(coinTokenAddress, AirlineCoin.abi)

interface ClaimNFTPayload {
  to: Hex
  quantity: number
  nft: NFT
}

interface UseClaimNFT {
  // eslint-disable-next-line no-unused-vars
  claimAircraftNFT: (payload: ClaimNFTPayload) => Promise<string | undefined>
  // eslint-disable-next-line no-unused-vars
  claimNFT: (payload: ClaimNFTPayload) => Promise<string | undefined>
  isClaiming: boolean
}

const useClaimNFT = (contract?: SmartContract<BaseContract>): UseClaimNFT => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { smartAccountAddress, paymasterSigner, smartSigner } = useAlchemyProviderContext()

  const claimAircraftNFT = useCallback(
    async ({ to, quantity, nft }: ClaimNFTPayload) => {
      if (!paymasterSigner || !smartSigner || !contract || !smartAccountAddress) return
      setIsClaiming(true)

      try {
        const canClaim = await contract.erc1155.claimConditions.canClaim(nft.metadata.id, 1, smartAccountAddress)
        if (!canClaim) {
          setIsClaiming(false)
          throw new Error('user cannot claim this Aircraft')
        }

        const activePhase = await contract.erc1155.claimConditions.getActive(nft.metadata.id, { withAllowList: true })

        const encodedApproveCallData = erc20Contract.interface.encodeFunctionData('approve', [
          nftAircraftTokenAddress,
          activePhase.price
        ]) as Hex

        const { hash: approveTx } = await smartSigner.sendUserOperation({
          target: coinTokenAddress,
          data: encodedApproveCallData
        })

        await paymasterSigner.waitForUserOperationTransaction(approveTx as Hex)

        const erc1155Contract = new ethers.Contract(nftAircraftTokenAddress, contract.abi)
        const encodedCallData = erc1155Contract.interface.encodeFunctionData('claim', [
          to,
          nft.metadata.id,
          quantity,
          activePhase.currencyAddress,
          activePhase.price,
          {
            proof: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
            quantityLimitPerWallet: 1,
            pricePerToken: activePhase.price,
            currency: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          },
          '0x00'
        ])

        const { hash: claimHash } = await paymasterSigner.sendUserOperation({
          target: nftAircraftTokenAddress,
          data: encodedCallData as Hex
        })

        await paymasterSigner.waitForUserOperationTransaction(claimHash as Hex)

        setIsClaiming(false)
        return claimHash
      } catch (err) {
        console.error(err)
        return ''
      }
    },
    [contract, paymasterSigner, smartAccountAddress, smartSigner]
  )

  const claimNFT = useCallback(
    async ({ to, quantity, nft }: ClaimNFTPayload) => {
      if (!paymasterSigner || !contract || !smartAccountAddress) return
      setIsClaiming(true)

      const attribute = getNFTAttributes(nft).find((attr) => attr.trait_type === 'price')
      if (!attribute) {
        setIsClaiming(false)
        return
      }

      const canClaim = await contract.erc1155.claimConditions.canClaim(nft.metadata.id, 1, smartAccountAddress)
      if (!canClaim) {
        setIsClaiming(false)
        return
      }

      const activePhase = await contract.erc1155.claimConditions.getActive(nft.metadata.id, { withAllowList: true })

      const encodedApproveCallData = erc20Contract.interface.encodeFunctionData('approve', [
        nftLicenseTokenAddress,
        activePhase.price
      ]) as Hex

      const { hash: approveTx } = await paymasterSigner.sendUserOperation({
        target: coinTokenAddress,
        data: encodedApproveCallData
      })

      await paymasterSigner.waitForUserOperationTransaction(approveTx as Hex)

      const erc1155Contract = new ethers.Contract(nftLicenseTokenAddress, contract.abi)
      const encodedCallData = erc1155Contract.interface.encodeFunctionData('claim', [
        to,
        nft.metadata.id,
        quantity,
        coinTokenAddress,
        activePhase.price,
        {
          proof: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
          quantityLimitPerWallet: 0,
          pricePerToken: 0,
          currency: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        },
        '0x00'
      ])

      const { hash: claimHash } = await paymasterSigner.sendUserOperation({
        target: nftLicenseTokenAddress,
        data: encodedCallData as Hex
      })

      setIsClaiming(false)
      return claimHash
    },
    [contract, paymasterSigner, smartAccountAddress]
  )

  return { claimNFT, claimAircraftNFT, isClaiming }
}

export default useClaimNFT
