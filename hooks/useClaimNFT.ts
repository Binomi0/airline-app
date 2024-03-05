import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { coinTokenAddress, nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { BaseContract, ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { NFT, SmartContract } from '@thirdweb-dev/sdk'
import { Hex } from '@alchemy/aa-core'
import useERC20 from './useERC20'

interface UseClaimNFT {
  // eslint-disable-next-line no-unused-vars
  claimAircraftNFT: (nft: NFT) => Promise<string | undefined>
  // eslint-disable-next-line no-unused-vars
  claimLicenseNFT: (nft: NFT) => Promise<string | undefined>
  isClaiming: boolean
}

const useClaimNFT = (contract?: SmartContract<BaseContract>): UseClaimNFT => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { smartAccountAddress, smartSigner } = useAlchemyProviderContext()
  const { setAllowance, getAllowance } = useERC20(coinTokenAddress)

  const claimAircraftNFT = useCallback(
    async (aircraftNFT: NFT) => {
      if (!smartSigner || !smartSigner.account || !contract || !smartAccountAddress) {
        throw new Error('Missing params')
      }
      setIsClaiming(true)

      try {
        const canClaim = await contract.erc1155.claimConditions.canClaim(
          aircraftNFT.metadata.id,
          1,
          smartAccountAddress
        )
        if (!canClaim) {
          setIsClaiming(false)
          throw new Error('user cannot claim this Aircraft')
        }

        const allowance = await getAllowance(nftAircraftTokenAddress)
        if (allowance.isZero()) {
          await setAllowance(nftAircraftTokenAddress)
        }

        const activePhase = await contract.erc1155.claimConditions.getActive(aircraftNFT.metadata.id, {
          withAllowList: true
        })
        const erc1155Contract = new ethers.Contract(nftAircraftTokenAddress, contract.abi)
        const nftId = Number(aircraftNFT.metadata.id)
        const encodedData = ethers.utils.defaultAbiCoder.encode(['uint256'], [nftId > 0 ? nftId - 1 : 0])
        const encodedCallData = erc1155Contract.interface.encodeFunctionData('claim', [
          smartAccountAddress,
          aircraftNFT.metadata.id,
          1,
          activePhase.currencyAddress,
          activePhase.price,
          {
            proof: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
            quantityLimitPerWallet: activePhase.maxClaimablePerWallet,
            pricePerToken: activePhase.price,
            currency: activePhase.currencyAddress
          },
          ethers.utils.hexlify(encodedData)
        ])

        const uo = await smartSigner.sendUserOperation({
          account: smartSigner.account,
          uo: {
            target: nftAircraftTokenAddress,
            data: encodedCallData as Hex
          }
        })

        const txHash = await smartSigner.waitForUserOperationTransaction(uo)

        setIsClaiming(false)
        return txHash
      } catch (err) {
        setIsClaiming(false)
        throw new Error((err as Error).message)
      }
    },
    [contract, getAllowance, setAllowance, smartAccountAddress, smartSigner]
  )

  const claimLicenseNFT = useCallback(
    async (nft: NFT) => {
      try {
        if (!smartSigner || !smartSigner.account || !contract || !smartAccountAddress) return
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
        console.log(allowance.toString())
        console.log(allowance.isZero())

        const activePhase = await contract.erc1155.claimConditions.getActive(nft.metadata.id, { withAllowList: true })
        console.log({ activePhase })
        const erc1155Contract = new ethers.Contract(nftLicenseTokenAddress, contract.abi)
        const nftId = Number(nft.metadata.id)
        console.log({ nftId })
        const encodedData = ethers.utils.defaultAbiCoder.encode(['uint256'], [nftId > 0 ? nftId - 1 : 0])
        console.log({ encodedData })
        const encodedCallData = erc1155Contract.interface.encodeFunctionData('claim', [
          smartAccountAddress,
          nft.metadata.id,
          1,
          coinTokenAddress,
          activePhase.price,
          {
            proof: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
            quantityLimitPerWallet: activePhase.maxClaimablePerWallet,
            pricePerToken: activePhase.price,
            currency: activePhase.currencyAddress
          },
          ethers.utils.hexlify(encodedData)
        ])

        const uo = await smartSigner.sendUserOperation({
          account: smartSigner.account,
          uo: {
            target: nftLicenseTokenAddress,
            data: encodedCallData as Hex
          }
        })

        const txHash = await smartSigner.waitForUserOperationTransaction(uo)

        setIsClaiming(false)
        return txHash
      } catch (err) {
        console.error(err)
        setIsClaiming(false)
        throw new Error('While claiming NFT')
      }
    },
    [contract, getAllowance, setAllowance, smartAccountAddress, smartSigner]
  )

  return { claimLicenseNFT, claimAircraftNFT, isClaiming }
}

export default useClaimNFT
