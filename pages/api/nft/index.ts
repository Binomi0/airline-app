import { connectDB, dbDisconnect } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import alchemy from 'lib/alchemy'
import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import Nft from 'models/Nft'
import User from 'models/User'
import { NFT } from 'thirdweb'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const dbNfts = await Nft.find<NFT[]>({})
      if (dbNfts.length === 0) {

        return res.redirect('/api/nft/refresh')
      }

      return res.status(200).json(dbNfts)
    } catch (error) {
      console.error('API NFT error:', error)

      return res.status(500).send('Ha ocurrido un error al obtener los nfts')
    }
  } else if (req.method === 'DELETE') {
    // Implement delete logic if needed
  }

  res.status(405).end()
}

export default handler
