import { NftMetadataBatchToken, NftTokenType } from 'alchemy-sdk'
import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import alchemy from 'lib/alchemy'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import cache from 'lib/cache'

const aircrafts: NftMetadataBatchToken[] = [
  {
    contractAddress: nftAircraftTokenAddress,
    tokenId: '0',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftAircraftTokenAddress,
    tokenId: '1',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftAircraftTokenAddress,
    tokenId: '2',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftAircraftTokenAddress,
    tokenId: '3',
    tokenType: NftTokenType.ERC1155
  }
]

const licenses: NftMetadataBatchToken[] = [
  {
    contractAddress: nftLicenseTokenAddress,
    tokenId: '0',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftLicenseTokenAddress,
    tokenId: '1',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftLicenseTokenAddress,
    tokenId: '2',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftLicenseTokenAddress,
    tokenId: '3',
    tokenType: NftTokenType.ERC1155
  }
]
const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const cacheKey = 'alchemy_nfts_metadata'
      const cachedResponse = await cache.get(cacheKey)
      if (cachedResponse) {
        return res.status(200).send(cachedResponse)
      }

      const response = await alchemy.nft.getNftMetadataBatch([...aircrafts, ...licenses])
      await cache.set(cacheKey, response, 3600) // Cache for 1 hour
      res.status(200).send(response)
      return
    } catch (error) {
      console.error('NFTS ERROR', error)
      res.status(400).send(error)
      return
    }
  } else if (req.method === 'POST') {
    try {
      const address = req.body.address
      if (!address) return res.status(400).send('Address is required')

      const cacheKey = `alchemy_nfts_owner_${address.toLowerCase()}`
      const cachedResponse = await cache.get(cacheKey)
      if (cachedResponse) {
        return res.status(200).send(cachedResponse)
      }

      const response = await alchemy.nft.getNftsForOwner(address)
      await cache.set(cacheKey, response, 600) // Cache for 10 minutes
      res.status(200).send(response)
      return
    } catch (error) {
      console.error('NFTS ERROR', error)
      res.status(400).send(error)
      return
    }
  }
  res.status(405).end()
}

export default withAuth(handler)
