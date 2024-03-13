import { NextApiResponse } from 'next'
import { coinTokenAddress } from 'contracts/address'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import sdk from 'lib/twSdk'
import Wallet from 'models/Wallet'

interface ApiRequest extends CustomNextApiRequest {
  body: {
    smartAccountAddress: string
    id: string
    signerAddress: string
  }
}

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }
  if (!req.body.smartAccountAddress || !req.body.id || !req.body.signerAddress) {
    res.status(400).end()
    return
  }
  if (!process.env.THIRDWEB_AUTH_PRIVATE_KEY) {
    res.status(403).end()
    return
  }

  const { smartAccountAddress } = req.body
  try {
    const requested = await Wallet.findOne({ smartAccountAddress })
    if (requested) {
      res.status(202).end()
      return
    }

    // amount to fill to each connected smartAccountAddress
    const amount = '2'
    const balance = await sdk.wallet.balance(coinTokenAddress)
    console.log('current main account balance =>', balance)
    if (balance.value.lte(amount)) {
      throw new Error('Missing funds in main account')
    }

    // Send founds to new user
    // sdk.wallet.transfer(smartAccountAddress, amount, coinTokenAddress)
    await Wallet.create({
      id: req.body.id,
      email: req.user,
      smartAccountAddress: req.body.smartAccountAddress,
      signerAddress: req.body.signerAddress,
      amount,
      // set {starterGift: true} if initial transfer was succesful
      starterGift: false
    })

    res.status(201).end()
  } catch (error) {
    console.error('error =>', error)
    res.status(500).json(error)
  }
}

export default withAuth(handler)
