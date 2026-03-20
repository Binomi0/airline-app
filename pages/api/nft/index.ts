import { connectDB } from 'lib/mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import Nft, { INft } from 'models/Nft'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const dbNfts = await Nft.find<INft[]>({})
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
