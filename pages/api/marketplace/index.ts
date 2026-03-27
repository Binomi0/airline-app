import { connectDB } from 'lib/mongoose'
import { NextApiResponse } from 'next'
import MarketplaceListing from 'models/MarketplaceListing'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const { type, status = 'ACTIVE' } = req.query
      if (!type) {
        return res.status(400).end()
      }

      const listings = await MarketplaceListing.find({ status, type })
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
  } else if (req.method === 'POST') {
    try {
      const { nftId, price, currency, type, tokenId, tokenAddress, chainId, expiresAt, allowedDurations } = req.body

      // Basic validation
      if (!nftId || !price || !tokenId || !tokenAddress) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' })
      }

      const listing = new MarketplaceListing({
        nft: nftId,
        seller: req.id,
        price,
        currency: currency || 'AIRL',
        type: type || 'SALE',
        status: 'ACTIVE',
        tokenId,
        tokenAddress,
        chainId,
        expiresAt,
        allowedDurations
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

export default withAuth(handler)
