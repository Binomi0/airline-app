import { NextApiResponse } from 'next'
import { coinTokenAddress } from 'contracts/address'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Wallet from 'models/Wallet'
import { getContract, readContract, sendAndConfirmTransaction } from 'thirdweb'
import { privateKeyToAccount } from 'thirdweb/wallets'
import { transfer } from 'thirdweb/extensions/erc20'
import { twClient, activeChain as chain } from 'config'

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

    const serverAccount = privateKeyToAccount({
      client: twClient,
      privateKey: process.env.THIRDWEB_AUTH_PRIVATE_KEY
    })

    // amount to fill to each connected smartAccountAddress
    const amount = '2'

    // In v5 we use readContract for balance checks if getWalletBalance is not available
    const balanceWei = await readContract({
      contract: {
        client: twClient,
        chain,
        address: coinTokenAddress as `0x${string}`
      },
      method: "function balanceOf(address) view returns (uint256)",
      params: [serverAccount.address as `0x${string}`]
    })

    const balanceValue = Number(balanceWei) / 1e18
    console.log('current main account balance =>', balanceValue)
    if (balanceValue <= Number(amount)) {
      throw new Error('Missing funds in main account')
    }

    // Send funds to new user
    const transaction = transfer({
      contract: getContract({
        client: twClient,
        chain,
        address: coinTokenAddress as `0x${string}`
      }),
      to: smartAccountAddress as `0x${string}`,
      amount: amount
    })

    const receipt = await sendAndConfirmTransaction({
      transaction,
      account: serverAccount
    })

    console.log('Starter funds transfer successful:', receipt.transactionHash)

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
