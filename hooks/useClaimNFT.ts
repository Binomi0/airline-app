import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { encodeAbiParameters } from 'thirdweb/utils'
import { useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { userState } from 'store/user.atom'
import { Hex, prepareContractCall, PreparedTransaction, sendBatchTransaction, waitForReceipt } from 'thirdweb'
import axios from 'config/axios'
import useWallet from './useWallet'
import { INft } from 'models/Nft'

interface UseClaimNFT {
  claimAircraftNFT: (nft: INft) => Promise<Hex | undefined>
  claimLicenseNFT: (nft: INft) => Promise<Hex | undefined>
  isClaiming: boolean
}

const NATIVE_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const useClaimNFT = (): UseClaimNFT => {
  const [isClaiming, setIsClaiming] = useState(false)
  const { smartSigner, twClient, twChain, smartAccountAddress, isLocked } = useRecoilValue(walletStore)
  const user = useRecoilValue(userState)
  const { unlockSigner } = useWallet()

  const checkAndSetAllowance = useCallback(
    async (
      tokenAddress: string,
      spender: string,
      amount: bigint,
      ownerAddress: string
    ): Promise<PreparedTransaction | undefined> => {
      if (tokenAddress.toLowerCase() === NATIVE_TOKEN) return undefined

      const { data: allowance } = await axios.post('/api/contracts/read', {
        address: tokenAddress,
        method: 'function allowance(address owner, address spender) view returns (uint256)',
        params: [ownerAddress, spender]
      })

      const safeAllowance = BigInt(allowance?.toString() ?? '0')

      if (safeAllowance < amount) {
        const tx = prepareContractCall({
          contract: { client: twClient!, chain: twChain!, address: tokenAddress as Hex },
          method: 'function approve(address spender, uint256 amount)',
          // Minimum Privilege: Approve ONLY the necessary amount
          params: [spender, amount]
        })
        return tx as PreparedTransaction
      }

      return undefined
    },
    [twClient, twChain]
  )

  const claimNFT = useCallback(
    async (contractAddress: Hex, nft: INft) => {
      let account = smartSigner

      if (isLocked && user) {
        try {
          account = await unlockSigner(user)
        } catch (e) {
          console.error('Failed to unlock signer:', e)
          throw new Error('Wallet must be unlocked to perform transactions')
        }
      }

      if (!account || !twClient || !twChain || !smartAccountAddress) {
        throw new Error('Missing wallet params')
      }
      setIsClaiming(true)

      try {
        const transactions: PreparedTransaction[] = []
        const nftId = BigInt(nft.id)

        // Fetch claim condition dynamically
        const { data: condition } = await axios.post('/api/contracts/read', {
          address: contractAddress,
          method:
            'function claimCondition(uint256) view returns (uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata)',
          params: [nftId]
        })
        const [, , , rawQuantityLimitPerWallet, , rawPricePerToken, currency] = condition

        // Ensure robust type safety by explicitly parsing values to BigInt
        const txPricePerToken = BigInt(rawPricePerToken?.toString() ?? '0')
        const txQuantityLimitPerWallet = BigInt(rawQuantityLimitPerWallet?.toString() ?? '0')

        const approveTx = await checkAndSetAllowance(currency, contractAddress, txPricePerToken, account.address)

        const encodedData = encodeAbiParameters([{ type: 'uint256' }], [nftId > 0n ? nftId - 1n : 0n])

        const mintTx = prepareContractCall({
          contract: {
            client: twClient,
            chain: twChain,
            address: contractAddress as Hex
          },
          method:
            'function claim(address receiver, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, (bytes32[] proof, uint256 quantityLimitPerWallet, uint256 pricePerToken, address currency) allowlistProof, bytes data)',
          params: [
            account.address,
            nftId,
            1n,
            currency,
            txPricePerToken,
            {
              proof: ['0x0000000000000000000000000000000000000000000000000000000000000000' as Hex],
              quantityLimitPerWallet: txQuantityLimitPerWallet,
              pricePerToken: txPricePerToken,
              currency
            },
            encodedData as Hex
          ],
          value: currency.toLowerCase() === NATIVE_TOKEN ? txPricePerToken : 0n
        }) as PreparedTransaction

        if (approveTx) {
          transactions.push(approveTx)
        }
        transactions.push(mintTx)

        const result = await sendBatchTransaction({
          transactions,
          account
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

  const claimAircraftNFT = useCallback((nft: INft) => claimNFT(nftAircraftTokenAddress, nft), [claimNFT])
  const claimLicenseNFT = useCallback((nft: INft) => claimNFT(nftLicenseTokenAddress, nft), [claimNFT])

  return { claimLicenseNFT, claimAircraftNFT, isClaiming }
}

export default useClaimNFT
