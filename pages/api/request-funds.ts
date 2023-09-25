import { NextApiResponse } from 'next'
import { coinTokenAddress } from 'contracts/address'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import sdk from 'lib/twSdk'
import { connectDB } from 'lib/mongoose'
import Wallet from 'models/Wallet'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }
  if (!req.body.smartAccountAddress || !req.body.smartAccountAddress || !req.body.id) {
    res.status(400).end()
    return
  }
  if (!process.env.THIRDWEB_AUTH_PRIVATE_KEY) {
    res.status(403).end()
    return
  }

  const { smartAccountAddress } = req.body
  await connectDB()
  try {
    const requested = await Wallet.findOne({ smartAccountAddress })
    if (requested) {
      res.status(202).end()
      return
    }

    // amount to fill to each connected smartAccountAddress
    const amount = 2
    const balance = await sdk.wallet.balance(coinTokenAddress)
    if (balance.value.lte(amount)) {
      throw new Error('Missing funds in main account')
    }
    sdk.wallet.transfer(smartAccountAddress, amount, coinTokenAddress)
    await Wallet.create({
      id: req.body.id,
      email: req.user,
      smartAccountAddress: req.body.smartAccountAddress,
      signerAddress: req.body.signerAddress,
      amount,
      starterGift: true
    })

    res.status(201).end()
  } catch (error) {
    console.error('error =>', error)
    res.status(500).json(error)
  }
}

export default withAuth(handler)
