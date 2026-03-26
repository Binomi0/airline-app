import { connectDB } from 'lib/mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import MarketplaceListing from 'models/MarketplaceListing'
import Nft from 'models/Nft'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const { type, status = 'ACTIVE' } = req.query
      const query: any = { status }

      if (type) query.type = type

      const listings = await MarketplaceListing.find(query)
        .populate('nft')
        .populate({
          path: 'seller',
          select: 'email address'
        })
        .sort({ createdAt: -1 })

      return res.status(200).json(listings)
    } catch (error) {
      console.error('Marketplace GET error:', error)
      return res.status(500).json({ error: 'Error al obtener listados del marketplace' })
    }
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    try {
      const { nftId, price, currency, type, tokenId, tokenAddress, chainId, expiresAt } = req.body

      // Basic validation
      if (!nftId || !price || !tokenId || !tokenAddress) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' })
      }

      const listing = new MarketplaceListing({
        nft: nftId,
        seller: (session.user as any).id,
        price,
        currency: currency || 'AIRL',
        type: type || 'SALE',
        status: 'ACTIVE',
        tokenId,
        tokenAddress,
        chainId,
        expiresAt
      })

      await listing.save()
      return res.status(201).json(listing)
    } catch (error) {
      console.error('Marketplace POST error:', error)
      return res.status(500).json({ error: 'Error al crear el listado' })
    }
  }

  res.status(405).end()
}

export default handler
