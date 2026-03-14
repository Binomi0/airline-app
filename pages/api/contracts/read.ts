import { activeChain } from 'config'
import { readContract, getContract, createThirdwebClient } from 'thirdweb'
import cache from 'lib/cache'
import { NextApiResponse } from 'next'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'

import { z } from 'zod'

export const twServer = createThirdwebClient({
  secretKey: process.env.TW_SECRET_KEY || ''
})

const ReadContractSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  method: z.union([z.string().min(1), z.record(z.unknown())]),
  params: z.array(z.string()).optional().default([])
})

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const { address, method, params } = req.body

  const cacheKey = `contract_read_${address.toLowerCase()}_${JSON.stringify(method)}_${JSON.stringify(params || [])}`

  try {
    const cachedResponse = await cache.get(cacheKey)
    if (cachedResponse) {
      return res.status(200).json(cachedResponse)
    }

    const contract = getContract({
      client: twServer,
      chain: activeChain,
      address
    })

    const result = await readContract({
      contract,
      method,
      params: params || []
    })

    const serializedResult = typeof result === 'bigint' ? (result as bigint).toString() : (result as unknown)

    await cache.set(cacheKey, serializedResult, 60) // Cache for 1 minute

    res.status(200).json(serializedResult)
  } catch (error) {
    console.error('Contract Read Error:', error)
    res.status(500).send((error as Error).message)
  }
}

export default withAuth(handler)
