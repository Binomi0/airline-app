import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import User from 'models/User'
import Wallet from 'models/Wallet'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.smartAccountAddress || !req.body.signerAddress) {
      res.status(400).end()
      return
    }
    try {
      await Wallet.findOneAndUpdate(
        { email: req.user },
        {
          id: req.userId,
          email: req.user,
          smartAccountAddress: req.body.smartAccountAddress,
          signerAddress: req.body.signerAddress,
          encryptedVault: req.body.encryptedVault,
          iv: req.body.iv
        },
        { upsert: true }
      )
      await User.findOneAndUpdate({ email: req.user }, { address: req.body.smartAccountAddress })

      // const wallet = await Wallet.findOne({ email: req.user })
      // FIXME: Remember to change initialization of startGift to true if wallet is funded
      // if (!wallet?.starterGift) {
      //   res.redirect('/api/request-funds')
      //   return
      // }

      res.status(202).end()
      return
    } catch (err) {
      res.status(500).send(err)
      return
    }
  } else if (req.method === 'GET') {
    const wallet = await Wallet.findOne({ email: req.user })
    if (!wallet) {
      res.status(204).end()
      return
    }
    res.status(200).send(wallet)
    return
  }

  res.status(405).end()
}

export default withAuth(handler)
