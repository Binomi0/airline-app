import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { ethers } from 'ethers'
import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { userState } from 'store/user.atom'
import { Hex, prepareContractCall, readContract, sendTransaction, waitForReceipt } from 'thirdweb'
import axios from 'config/axios'
import useWallet from './useWallet'

// We define a simplified NFT type to maintain internal consistency
interface NFT {
  id: bigint | string
  metadata: {
    id?: string | number
    name?: string
    description?: string
    image?: string
    [key: string]: any
  }
  [key: string]: any
}

interface UseClaimNFT {
  // eslint-disable-next-line no-unused-vars
  claimAircraftNFT: (nft: NFT) => Promise<string | undefined>
  // eslint-disable-next-line no-unused-vars
  claimLicenseNFT: (nft: NFT) => Promise<string | undefined>
  isClaiming: boolean
}

const NATIVE_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const useClaimNFT = (): UseClaimNFT => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { smartSigner, twClient, twChain, smartAccountAddress, isLocked } = useRecoilValue(walletStore)
  const user = useRecoilValue(userState)
  const { unlockSigner } = useWallet()

  const checkAndSetAllowance = useCallback(
    async (tokenAddress: string, spender: string, amount: bigint) => {
      if (tokenAddress.toLowerCase() === NATIVE_TOKEN) return

      const { data: allowance } = await axios.post('/api/contracts/read', {
        address: tokenAddress,
        method: 'function allowance(address owner, address spender) view returns (uint256)',
        params: [smartAccountAddress, spender]
      })

      if (BigInt(allowance) < amount) {
        const tx = prepareContractCall({
          contract: { client: twClient!, chain: twChain!, address: tokenAddress as Hex },
          method: 'function approve(address spender, uint256 amount)',
          params: [spender, ethers.constants.MaxUint256.toBigInt()]
        })
        const result = await sendTransaction({ transaction: tx, account: smartSigner! })
        await waitForReceipt(result)
      }
    },
    [smartAccountAddress, twClient, twChain, smartSigner]
  )

  const claimNFT = useCallback(
    async (contractAddress: string, nft: NFT) => {
      let currentSigner = smartSigner

      if (isLocked && user) {
        try {
          currentSigner = await unlockSigner(user)
        } catch (e) {
          console.error('Failed to unlock signer:', e)
          throw new Error('Wallet must be unlocked to perform transactions')
        }
      }

      if (!currentSigner || !twClient || !twChain || !smartAccountAddress) {
        throw new Error('Missing wallet params')
      }
      setIsClaiming(true)

      try {
        const nftId = BigInt(nft.id)

        // Fetch claim condition dynamically
        const condition = await readContract({
          contract: { client: twClient, chain: twChain, address: contractAddress as Hex },
          method:
            'function claimCondition(uint256) view returns (uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata)',
          params: [nftId]
        })

        const [, , , , , , currency] = condition
        const pricePerToken = condition[5]
        const quantityLimitPerWallet = condition[3]

        await checkAndSetAllowance(currency, contractAddress, pricePerToken)

        const encodedData = ethers.utils.defaultAbiCoder.encode(['uint256'], [nftId > 0n ? nftId - 1n : 0n])

        const tx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: contractAddress as Hex
          },
          method:
            'function claim(address receiver, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, (bytes32[] proof, uint256 quantityLimitPerWallet, uint256 pricePerToken, address currency) allowlistProof, bytes data)',
          params: [
            smartAccountAddress,
            nftId,
            1n,
            currency,
            pricePerToken,
            {
              proof: ['0x0000000000000000000000000000000000000000000000000000000000000000' as Hex],
              quantityLimitPerWallet,
              pricePerToken,
              currency
            },
            encodedData as Hex
          ],
          value: currency.toLowerCase() === NATIVE_TOKEN ? pricePerToken : 0n
        })

        const result = await sendTransaction({
          transaction: tx,
          account: currentSigner
        })

        const receipt = await waitForReceipt(result)
        setIsClaiming(false)
        return receipt.transactionHash
      } catch (err) {
        console.error(`While claiming NFT at ${contractAddress}:`, err)
        setIsClaiming(false)
        throw err
      }
    },
    [smartAccountAddress, smartSigner, twChain, twClient, checkAndSetAllowance, isLocked, unlockSigner, user]
  )

  const claimAircraftNFT = useCallback((nft: NFT) => claimNFT(nftAircraftTokenAddress, nft), [claimNFT])
  const claimLicenseNFT = useCallback((nft: NFT) => claimNFT(nftLicenseTokenAddress, nft), [claimNFT])

  return { claimLicenseNFT, claimAircraftNFT, isClaiming }
}

export default useClaimNFT
