import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import alchemy from 'lib/alchemy'
import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import Nft from 'models/Nft'
import User from 'models/User'
import UserNft, { IUserNft } from 'models/UserNft'
import { AlchemyOwnedNft } from 'types/alchemy'
import { activeChain } from 'config'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    await connectDB()
    try {
      if (!req.id) {
        return res.status(401).send('Unauthorized')
      }
      const user = await User.findOne({ email: req.user })
      if (!user || !user.address) {
        return res.status(400).json({ error: 'User wallet not found' })
      }

      const address = user.address.toLowerCase()
      const forceRefresh = req.query.refresh === 'true'

      // Database-First: Check for NFTs in UserNft for this owner
      let ownedNftsInDb = await UserNft.find<IUserNft>({ address }).populate('nft')

      // If no NFTs in DB or forceRefresh, sync with Alchemy
      if (ownedNftsInDb.length === 0 || forceRefresh) {
        console.log(`[owned.ts] Syncing with Alchemy for ${address}`)
        const { ownedNfts } = await alchemy.nft.getNftsForOwner(address, {
          contractAddresses: [nftAircraftTokenAddress, nftLicenseTokenAddress]
        })

        if (ownedNfts.length > 0) {
          const syncPromises = (ownedNfts as unknown as AlchemyOwnedNft[]).map(async (ownedNft) => {
            const tokenId = ownedNft.tokenId
            const tokenAddress = ownedNft.contract.address.toLowerCase()

            // 1. Ensure global Nft metadata exists (could be missing if refresh.ts hasn't run)
            let nftDoc = await Nft.findOne({ id: tokenId, tokenAddress: tokenAddress.toLowerCase() })
            if (!nftDoc) {
              const tokenUri = ownedNft.tokenUri || ownedNft.raw.tokenUri || ''
              // Create a minimal Nft doc with info from Alchemy
              nftDoc = await Nft.create({
                id: tokenId,
                tokenAddress: tokenAddress.toLowerCase(),
                tokenURI: tokenUri,
                type: ownedNft.tokenType === 'ERC1155' ? 'ERC1155' : 'ERC721',
                chainId: 11155111, // Sepolia
                metadata: {
                  uri: tokenUri,
                  name: ownedNft.name || ownedNft.raw.metadata?.name || '',
                  description: ownedNft.description || ownedNft.raw.metadata?.description || '',
                  image: ownedNft.image?.cachedUrl || ownedNft.image?.originalUrl || ownedNft.raw.metadata?.image || '',
                  attributes: ownedNft.raw.metadata?.attributes || []
                }
              })
            }

            // 2. Link to UserNft
            return UserNft.findOneAndUpdate(
              {
                user: user._id,
                address,
                tokenId,
                tokenAddress: tokenAddress.toLowerCase()
              },
              {
                user: user._id,
                nft: nftDoc._id,
                address,
                tokenId,
                tokenAddress: tokenAddress.toLowerCase(),
                chainId: activeChain // Sepolia
              },
              { upsert: true, returnDocument: 'after' }
            )
          })

          await Promise.all(syncPromises)
          // Re-fetch populated data
          ownedNftsInDb = await UserNft.find({ address }).populate('nft')
        }
      }

      return res.status(200).json(ownedNftsInDb)
    } catch (error) {
      console.error('[owned.ts] Error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  res.status(405).end()
}

export default function withAuthOwnedHandler(req: CustomNextApiRequest, res: NextApiResponse) {
  return withAuth(handler)(req, res)
}
