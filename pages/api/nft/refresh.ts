import { connectDB } from 'lib/mongoose'
import { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import alchemy from 'lib/alchemy'
import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import Nft from 'models/Nft'
import User from 'models/User'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  await connectDB()

  if (req.method === 'GET') {
    try {
      // 1. Sync all NFTs from the contract (metadata)
      const aircraftNfts = await alchemy.nft.getNftsForContract(nftAircraftTokenAddress)
      const licenseNfts = await alchemy.nft.getNftsForContract(nftLicenseTokenAddress)
      const allNfts = [...aircraftNfts.nfts, ...licenseNfts.nfts]

      console.log(allNfts[0].raw.metadata.attributes)
      for (const nft of allNfts) {
        const tokenId = BigInt(nft.tokenId)
        const tokenUri = typeof nft.tokenUri === 'string' ? nft.tokenUri : (nft.tokenUri as any)?.raw || ''

        await Nft.findOneAndUpdate(
          { id: tokenId, tokenAddress: nft.contract.address },
          {
            metadata: {
              uri: tokenUri,
              name: nft.name || (nft as any).rawMetadata?.name,
              description: nft.description || (nft as any).rawMetadata?.description,
              image: nft.image?.cachedUrl || nft.image?.originalUrl || (nft as any).rawMetadata?.image,
              attributes: (nft as any).raw?.metadata?.attributes,
            },
            id: tokenId,
            tokenURI: tokenUri,
            type: nft.tokenType === 'ERC1155' ? 'ERC1155' : 'ERC721',
            tokenAddress: nft.contract.address,
            chainId: 11155111, // Sepolia
            supply: (nft as any).totalSupply ? BigInt((nft as any).totalSupply) : BigInt(0)
          },
          { upsert: true, new: true }
        )
      }

      // 2. Sync ownership for the current user if they have an address
      const user = await User.findById(req.id)
      if (user && user.address) {
        const ownedNfts = await alchemy.nft.getNftsForOwner(user.address, {
          contractAddresses: [nftAircraftTokenAddress, nftLicenseTokenAddress]
        })

        for (const ownedNft of ownedNfts.ownedNfts) {
           await Nft.findOneAndUpdate(
             { id: BigInt(ownedNft.tokenId), tokenAddress: ownedNft.contract.address },
             { owner: user.address },
             { new: true }
           )
        }
      }

      const dbNfts = await Nft.find({})
      return res.status(200).json(dbNfts)
    } catch (error) {
      console.error('API NFT error:', error)
      return res.status(500).send(error)
    }
  } else if (req.method === 'DELETE') {
    // Implement delete logic if needed
  }

  res.status(405).end()
}

export default handler
