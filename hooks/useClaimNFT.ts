import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { coinTokenAddress, nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { BaseContract, ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { NFT, SmartContract } from '@thirdweb-dev/sdk'
import { Hex } from '@alchemy/aa-core'
import useERC20 from './useERC20'

interface ClaimNFTPayload {
  to: Hex
  quantity: number
  nft: NFT
}

interface UseClaimNFT {
  // eslint-disable-next-line no-unused-vars
  claimAircraftNFT: (payload: ClaimNFTPayload) => Promise<string | undefined>
  // eslint-disable-next-line no-unused-vars
  claimLicenseNFT: (payload: ClaimNFTPayload) => Promise<string | undefined>
  isClaiming: boolean
}

const useClaimNFT = (contract?: SmartContract<BaseContract>): UseClaimNFT => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { smartAccountAddress, paymasterSigner } = useAlchemyProviderContext()
  const { setAllowance, getAllowance } = useERC20(coinTokenAddress)

  const claimAircraftNFT = useCallback(
    async ({ to, quantity, nft }: ClaimNFTPayload) => {
      if (!paymasterSigner || !contract || !smartAccountAddress) {
        throw new Error('Missing params')
      }
      setIsClaiming(true)

      try {
        const canClaim = await contract.erc1155.claimConditions.canClaim(nft.metadata.id, 1, smartAccountAddress)
        if (!canClaim) {
          setIsClaiming(false)
          throw new Error('user cannot claim this Aircraft')
        }

        const allowance = await getAllowance(nftAircraftTokenAddress)
        if (allowance.isZero()) {
          await setAllowance(nftAircraftTokenAddress)
        }

        const activePhase = await contract.erc1155.claimConditions.getActive(nft.metadata.id, { withAllowList: true })
        const erc1155Contract = new ethers.Contract(nftAircraftTokenAddress, contract.abi)
        const encodedCallData = erc1155Contract.interface.encodeFunctionData('claim', [
          to,
          nft.metadata.id,
          quantity,
          activePhase.currencyAddress,
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
          target: nftAircraftTokenAddress,
          data: encodedCallData as Hex
        })

        await paymasterSigner.waitForUserOperationTransaction(claimHash as Hex)

        setIsClaiming(false)
        return claimHash
      } catch (err) {
        setIsClaiming(false)
        throw new Error((err as Error).message)
      }
    },
    [contract, getAllowance, paymasterSigner, setAllowance, smartAccountAddress]
  )

  const claimLicenseNFT = useCallback(
    async ({ to, quantity, nft }: ClaimNFTPayload) => {
      try {
        if (!paymasterSigner || !contract || !smartAccountAddress) return
        setIsClaiming(true)

        const canClaim = await contract.erc1155.claimConditions.canClaim(nft.metadata.id, 1, smartAccountAddress)
        if (!canClaim) {
          setIsClaiming(false)
          return
        }


        const allowance = await getAllowance(nftLicenseTokenAddress)
        if (allowance.isZero()) {
          await setAllowance(nftLicenseTokenAddress)
        }

        const activePhase = await contract.erc1155.claimConditions.getActive(nft.metadata.id, { withAllowList: true })
        const erc1155Contract = new ethers.Contract(nftLicenseTokenAddress, contract.abi)
        const encodedCallData = erc1155Contract.interface.encodeFunctionData('claim', [
          to,
          nft.metadata.id,
          quantity,
          coinTokenAddress,
          activePhase.price,
          {
            proof: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
            quantityLimitPerWallet: activePhase.maxClaimablePerWallet,
            pricePerToken: activePhase.price,
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
      } catch (err) {
        console.error(err)
        setIsClaiming(false)
        throw new Error('While claiming NFT')
      }
    },
    [contract, getAllowance, paymasterSigner, setAllowance, smartAccountAddress]
  )

  return { claimLicenseNFT, claimAircraftNFT, isClaiming }
}

export default useClaimNFT
