import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Wallet from 'models/Wallet'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { encryptedVault, iv } = req.body

  if (!encryptedVault || !iv) {
    return res.status(400).json({ error: 'Missing encryptedVault or iv' })
  }

  try {
    const wallet = await Wallet.findOne({ email: req.user })
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' })
    }
    wallet.encryptedVault = encryptedVault
    wallet.iv = iv
    await wallet.save()

    return res.status(202).json({ success: true })
  } catch (error) {
    console.error('Error backing up wallet:', error)
    return res.status(500).json({ error: 'Failed to backup wallet' })
  }
}

export default withAuth(handler)
