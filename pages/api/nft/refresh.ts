import { connectDB } from 'lib/mongoose'
import { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import Nft from 'models/Nft'
import User from 'models/User'
import { getContract } from 'thirdweb'
import { getNFT, getOwnedNFTs } from 'thirdweb/extensions/erc1155'
import { twClient, activeChain as chain } from 'config'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  await connectDB()

  if (req.method === 'GET') {
    try {
      // Initialize contracts
      const aircraftContract = getContract({
        client: twClient,
        chain,
        address: nftAircraftTokenAddress
      })

      const licenseContract = getContract({
        client: twClient,
        chain,
        address: nftLicenseTokenAddress
      })

      // Helper function to fetch all tokens for a contract
      const fetchAllTokens = async (contract: any, contractAddress: string) => {
        let tokenId = 0n
        while (true) {
          try {
            const nft = await getNFT({
              contract,
              tokenId,
            })
            allNfts.push({ nft, contractAddress, type: nft.type || 'ERC1155' })
            tokenId++
          } catch (e) {
            // Assume we've reached the end of minted tokens when getNFT throws
            console.log(`Finished fetching NFTs for ${contractAddress} at tokenId ${tokenId}`)
            break
          }
        }
      }

      const allNfts: any[] = []

      await fetchAllTokens(aircraftContract, nftAircraftTokenAddress)
      await fetchAllTokens(licenseContract, nftLicenseTokenAddress)

      for (const { nft, contractAddress, type } of allNfts) {
        const tokenId = BigInt(nft.id)
        const tokenUri = nft.tokenURI || ''

        await Nft.findOneAndUpdate(
          { id: tokenId, tokenAddress: contractAddress },
          {
            metadata: {
              uri: tokenUri,
              name: nft.name,
              description: nft.description,
              image: nft.image?.cachedUrl || nft.image?.originalUrl || (nft as any).rawMetadata?.image,
              attributes: nft.metadata.attributes,
            },
            id: tokenId,
            tokenURI: tokenUri,
            type: type,
            tokenAddress: contractAddress,
            chainId: chain.id,
            supply: (nft as any).supply || BigInt(0),
            owner: nft.owner || null
          },
          { upsert: true, new: true }
        )
      }

      // Sync ownership for the current user if they have an address
      const user = await User.findById(req.id)
      if (user && user.address) {
        try {
          // Check ownership of Aircraft
          const ownedAircrafts = await getOwnedNFTs({ contract: aircraftContract, address: user.address })
          for (const owned of ownedAircrafts) {
            await Nft.findOneAndUpdate(
              { id: BigInt(owned.id), tokenAddress: nftAircraftTokenAddress },
              { owner: user.address },
              { new: true }
            )
          }
        } catch(e) { console.error('Error fetching owned aircrafts:', e) }

        try {
          // Check ownership of License
          const ownedLicenses = await getOwnedNFTs({ contract: licenseContract, address: user.address })
          for (const owned of ownedLicenses) {
            await Nft.findOneAndUpdate(
              { id: BigInt(owned.id), tokenAddress: nftLicenseTokenAddress },
              { owner: user.address },
              { new: true }
            )
          }
        } catch(e) { console.error('Error fetching owned licenses:', e) }
      }

      const dbNfts = await Nft.find({})
      return res.status(200).json(dbNfts)
    } catch (error) {
      console.error('API NFT error:', error)
      return res.status(500).json({ error: String(error) })
    }
  } else if (req.method === 'DELETE') {
    // Implement delete logic if needed
  }

  res.status(405).end()
}

export default handler
