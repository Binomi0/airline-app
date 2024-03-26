import { Hex } from '@alchemy/aa-core'
import { useContract } from '@thirdweb-dev/react'
import { Contract } from 'ethers'
import { useCallback, useState } from 'react'
import AirlineCoin from 'contracts/abi/AirlineCoin.json'
import BigNumber from 'bignumber.js'
import { useRecoilState } from 'recoil'
import { walletStore } from 'store/wallet.atom'

const MAX_INT_ETH = '0x8000000000000000000000000000000000000000000000000000000000000000'

interface UseERC20ReturnType {
  // eslint-disable-next-line no-unused-vars
  getAllowance: (spender: Hex) => Promise<BigNumber>
  // eslint-disable-next-line no-unused-vars
  setAllowance: (to: Hex) => Promise<boolean>
  isLoading: boolean
}

const useERC20 = (tokenAddress: Hex): UseERC20ReturnType => {
  const [isLoading, setIsLoading] = useState(false)
  const { contract } = useContract(tokenAddress, 'token')
  const [wallet] = useRecoilState(walletStore)

  const getAllowance = useCallback(
    async (spender: string): Promise<BigNumber> => {
      if (!wallet.smartAccountAddress || !contract) return new BigNumber(0)
      setIsLoading(true)

      try {
        const allowance = await contract.erc20.allowanceOf(wallet.smartAccountAddress, spender)

        setIsLoading(false)
        return new BigNumber(allowance.displayValue)
      } catch (error) {
        console.error('getAllowance', error)
        setIsLoading(false)
        return new BigNumber(0)
      }
    },
    [wallet.smartAccountAddress, contract]
  )

  const setAllowance = useCallback(
    async (to: string) => {
      if (!wallet.smartSigner) return false
      try {
        setIsLoading(true)

        const erc20Contract = new Contract(tokenAddress, AirlineCoin.abi)
        const encodedCallData = erc20Contract.interface.encodeFunctionData('approve', [to, MAX_INT_ETH])

        const uo = await wallet.smartSigner.sendUserOperation({
          uo: { target: tokenAddress, data: encodedCallData as Hex }
        })
        const txHash = await wallet.smartSigner.waitForUserOperationTransaction(uo)
        console.log({ txHash })
        setIsLoading(false)
        return true
      } catch (error) {
        console.error('[setAllowance]', error)
        setIsLoading(false)
        throw new Error('Error while setAllowance')
      }
    },
    [wallet.smartSigner, tokenAddress]
  )
  return { setAllowance, getAllowance, isLoading }
}

export default useERC20
