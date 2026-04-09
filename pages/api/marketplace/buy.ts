import { connectDB } from 'lib/mongoose'
import { NextApiResponse } from 'next'
import MarketplaceListing from 'models/MarketplaceListing'
import UserNft from 'models/UserNft'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  await connectDB()

  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { listingId } = req.body

  if (!listingId) {
    return res.status(400).json({ error: 'Falta el ID del listado' })
  }

  try {
    const listing = await MarketplaceListing.findById(listingId)

    if (!listing || listing.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Listado no encontrado o ya no está activo' })
    }

    const buyerId = req.id

    if (listing.seller.toString() === buyerId) {
      return res.status(400).json({ error: 'No puedes comprar tu propio listado' })
    }

    // Update listing status
    listing.status = 'COMPLETED'
    listing.buyer = buyerId
    await listing.save()

    // Update UserNFT ownership
    // Find the UserNFT that corresponds to this listing and update the user field
    const userNft = await UserNft.findOne({
      user: listing.seller,
      tokenId: listing.tokenId,
      tokenAddress: listing.tokenAddress
    })

    if (userNft) {
      userNft.user = buyerId
      // In a real app, 'address' might also need update if it's the wallet address
      // But we assume the middleware/sync keeps it correct
      await userNft.save()
    }

    return res.status(200).json({ message: 'Compra completada con éxito', listing })
  } catch (error) {
    console.error('Marketplace Purchase error:', error)
    return res.status(500).json({ error: 'Error al procesar la compra' })
  }
}

export default withAuth(handler)
