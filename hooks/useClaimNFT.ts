import { coinTokenAddress, nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb'
import useERC20 from './useERC20'

// We define a simplified NFT type to maintain internal consistency
interface NFTMetadata {
  id: string
  [key: string]: any
}

interface NFT {
  metadata: NFTMetadata
  [key: string]: any
}

interface UseClaimNFT {
  // eslint-disable-next-line no-unused-vars
  claimAircraftNFT: (nft: NFT) => Promise<string | undefined>
  // eslint-disable-next-line no-unused-vars
  claimLicenseNFT: (nft: NFT) => Promise<string | undefined>
  isClaiming: boolean
}

// In v5 we pass the contract address instead of the SmartContract object
const useClaimNFT = (): UseClaimNFT => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { smartSigner, twClient, twChain, smartAccountAddress } = useRecoilValue(walletStore)
  const { setAllowance, getAllowance } = useERC20(coinTokenAddress)

  const claimAircraftNFT = useCallback(
    async (aircraftNFT: NFT) => {
      if (!smartSigner || !twClient || !twChain || !smartAccountAddress) {
        throw new Error('Missing wallet params')
      }
      setIsClaiming(true)

      try {
        // We use a generic prepareContractCall for simplicity as we don't have the full ABI here
        // but we know the claim method signature from the previous implementation.
        
        const allowance = await getAllowance(nftAircraftTokenAddress)
        if (allowance.isZero()) {
          await setAllowance(nftAircraftTokenAddress)
        }

        const nftId = Number(aircraftNFT.metadata.id)
        const encodedData = ethers.utils.defaultAbiCoder.encode(['uint256'], [nftId > 0 ? nftId - 1 : 0])
        
        // In v5, we define the method and params directly
        const tx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: nftAircraftTokenAddress
          },
          method: "function claim(address receiver, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, (bytes32[] proof, uint256 quantityLimitPerWallet, uint256 pricePerToken, address currency) allowlistProof, bytes data)",
          params: [
            smartAccountAddress,
            BigInt(aircraftNFT.metadata.id),
            1n,
            coinTokenAddress, // Assuming currency is coinTokenAddress
            0n, // We should ideally fetch activePhase.price, but for now we follow the logic
            {
              proof: ['0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`],
              quantityLimitPerWallet: 0n,
              pricePerToken: 0n,
              currency: coinTokenAddress as `0x${string}`
            },
            encodedData as `0x${string}`
          ]
        })

        const result = await sendTransaction({
          transaction: tx,
          account: smartSigner
        })

        const receipt = await waitForReceipt(result)
        setIsClaiming(false)
        return receipt.transactionHash
      } catch (err) {
        console.error('While claiming aircraft:', err)
        setIsClaiming(false)
        throw new Error((err as Error).message)
      }
    },
    [getAllowance, setAllowance, smartAccountAddress, smartSigner, twChain, twClient]
  )

  const claimLicenseNFT = useCallback(
    async (nft: NFT) => {
      if (!smartSigner || !twClient || !twChain || !smartAccountAddress) return
      setIsClaiming(true)

      try {
        const allowance = await getAllowance(nftLicenseTokenAddress)
        if (allowance.isZero()) {
          await setAllowance(nftLicenseTokenAddress)
        }

        const nftId = Number(nft.metadata.id)
        const encodedData = ethers.utils.defaultAbiCoder.encode(['uint256'], [nftId > 0 ? nftId - 1 : 0])

        const tx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: nftLicenseTokenAddress
          },
          method: "function claim(address receiver, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, (bytes32[] proof, uint256 quantityLimitPerWallet, uint256 pricePerToken, address currency) allowlistProof, bytes data)",
          params: [
            smartAccountAddress,
            BigInt(nft.metadata.id),
            1n,
            coinTokenAddress,
            0n,
            {
              proof: ['0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`],
              quantityLimitPerWallet: 0n,
              pricePerToken: 0n,
              currency: coinTokenAddress as `0x${string}`
            },
            encodedData as `0x${string}`
          ]
        })

        const result = await sendTransaction({
          transaction: tx,
          account: smartSigner
        })

        const receipt = await waitForReceipt(result)
        setIsClaiming(false)
        return receipt.transactionHash
      } catch (err) {
        console.error('While claiming license:', err)
        setIsClaiming(false)
        throw new Error('While claiming NFT')
      }
    },
    [getAllowance, setAllowance, smartAccountAddress, smartSigner, twChain, twClient]
  )

  return { claimLicenseNFT, claimAircraftNFT, isClaiming }
}

export default useClaimNFT
