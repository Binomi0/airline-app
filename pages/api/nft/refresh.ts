import { connectDB } from 'lib/mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import alchemy from 'lib/alchemy'
import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import Nft from 'models/Nft'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB()

  if (req.method === 'GET') {
    try {
      // 1. Sync all NFTs from the contract (metadata)
      const aircraftNfts = await alchemy.nft.getNftsForContract(nftAircraftTokenAddress)
      const licenseNfts = await alchemy.nft.getNftsForContract(nftLicenseTokenAddress)
      const allNfts = [...aircraftNfts.nfts, ...licenseNfts.nfts]

      for (const nftItem of allNfts) {
        const nft = nftItem as {
          tokenId: string
          tokenUri?: { raw?: string } | string
          contract: { address: string }
          name?: string
          description?: string
          image?: { cachedUrl?: string; originalUrl?: string }
          rawMetadata?: { name?: string; description?: string; image?: string }
          raw?: { metadata?: { attributes?: unknown } }
          tokenType?: string
          totalSupply?: string
        }
        const tokenId = BigInt(nft.tokenId)
        const tokenUri = typeof nft.tokenUri === 'string' ? nft.tokenUri : nft.tokenUri?.raw || ''

        await Nft.findOneAndUpdate(
          { id: tokenId, tokenAddress: nft.contract.address.toLowerCase() },
          {
            metadata: {
              uri: tokenUri,
              name: nft.name || nft.rawMetadata?.name,
              description: nft.description || nft.rawMetadata?.description,
              image: nft.image?.cachedUrl || nft.image?.originalUrl || nft.rawMetadata?.image,
              attributes: nft.raw?.metadata?.attributes
            },
            id: tokenId,
            tokenURI: tokenUri,
            type: nft.tokenType === 'ERC1155' ? 'ERC1155' : 'ERC721',
            tokenAddress: nft.contract.address.toLowerCase(),
            chainId: 11155111, // Sepolia
            supply: nft.totalSupply ? BigInt(nft.totalSupply) : BigInt(0)
          },
          { upsert: true, returnDocument: 'after' }
        )
      }

      const dbNfts = await Nft.find({})
      return res.status(200).json(dbNfts)
    } catch (error) {
      console.error('API NFT error:', error)
      return res.status(500).send(error)
    }
  }

  res.status(405).end()
}

export default handler
