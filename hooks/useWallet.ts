import { Wallet } from 'alchemy-sdk'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useCallback } from 'react'

interface UseWallet {
  initWallet: (id: string) => void
}

const useWallet = (): UseWallet => {
  const { setBaseSigner } = useAlchemyProviderContext()

  const initWallet = useCallback(
    (id: string) => {
      const walletId = localStorage.getItem(id)
      if (!walletId) {
        const random = Wallet.createRandom()
        localStorage.setItem(id, Buffer.from(random.privateKey).toString('base64'))

        setBaseSigner(random)
      } else {
        const signer = new Wallet(Buffer.from(walletId, 'base64').toString())

        setBaseSigner(signer)
      }
    },
    [setBaseSigner]
  )

  return { initWallet }
}

export default useWallet
