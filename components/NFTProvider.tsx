import { ReactNode, useMemo } from 'react'
import axios from 'config/axios'
import { Nft } from 'alchemy-sdk'

interface Props {
  // eslint-disable-next-line no-unused-vars
  children: ({ nfts }: { nfts: Promise<Nft[]> }) => ReactNode
}

const NFTProvider = ({ children }: Props) => {
  const nfts = useMemo(() => axios.get('api/alchemy/nfts').then((r) => r.data.nfts), [])
  return children({ nfts })
}

export default NFTProvider
