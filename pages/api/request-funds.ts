import { NextApiResponse } from 'next'
import { coinTokenAddress } from 'contracts/address'
import { CustomNextApiRequest } from 'lib/withAuth'
import Wallet from 'models/Wallet'
import { getContract, readContract, sendAndConfirmTransaction } from 'thirdweb'
import { privateKeyToAccount } from 'thirdweb/wallets'
import { transfer } from 'thirdweb/extensions/erc20'
import { twServer, activeChain as chain } from 'config'
import { z } from 'zod'

const RequestFundsSchema = z.object({
  smartAccountAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  id: z.string().min(1, 'ID is required'),
  signerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid signer address')
})

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (req.headers['x-api-key'] !== process.env.PRIVATE_API_KEY) {
    return res.status(403).end()
  }

  const validation = RequestFundsSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid request body', details: validation.error.format() })
  }

  const privateKey = process.env.THIRDWEB_AUTH_PRIVATE_KEY
  if (!privateKey) {
    console.error('THIRDWEB_AUTH_PRIVATE_KEY is missing')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const { smartAccountAddress, id, signerAddress } = validation.data

  try {
    const requested = await Wallet.findOne({ smartAccountAddress })
    if (requested) {
      return res.status(202).json({ message: 'Funds already requested' })
    }

    const serverAccount = privateKeyToAccount({
      client: twServer,
      privateKey
    })

    const amount = '2'

    const balanceWei = await readContract({
      contract: {
        client: twServer,
        chain,
        address: coinTokenAddress
      },
      method: 'function balanceOf(address) view returns (uint256)',
      params: [serverAccount.address]
    })

    const balanceValue = Number(balanceWei) / 1e18
    if (balanceValue <= Number(amount)) {
      console.error('Main account missing funds')
      return res.status(500).json({ error: 'Internal processing error' })
    }

    const transaction = transfer({
      contract: getContract({
        client: twServer,
        chain,
        address: coinTokenAddress
      }),
      to: smartAccountAddress,
      amount: amount
    })

    const receipt = await sendAndConfirmTransaction({
      transaction,
      account: serverAccount
    })

    console.log('Starter funds transfer successful:', receipt.transactionHash)

    await Wallet.create({
      id,
      email: req.user,
      smartAccountAddress,
      signerAddress,
      amount,
      starterGift: true
    })

    res.status(201).json({ success: true, transactionHash: receipt.transactionHash })
  } catch (error) {
    console.error('RequestFunds Error:', error)
    res.status(500).json({ error: 'An error occurred while processing your request' })
  }
}

export default handler
