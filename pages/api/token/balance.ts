import alchemy from 'lib/alchemy'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import cache from 'lib/cache'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const { address, token, tokens } = req.body

  if (!address || (!token && !tokens)) {
    res.status(400).send('Missing address, token or tokens')
    return
  }

  const tokenList: string[] = tokens || [token]
  const cacheKey = `token_balances_${address.toLowerCase()}_${[...tokenList].sort().join('_').toLowerCase()}`

  try {
    const cachedResponse = await cache.get(cacheKey)
    if (cachedResponse) {
      return res.status(200).send(cachedResponse)
    }

    const response = await alchemy.core.getTokenBalances(address, tokenList)
    await cache.set(cacheKey, response, 30) // Cache for 30 seconds

    res.status(200).send(response)
  } catch (error) {
    console.error('error =>', error)
    res.status(400).send(error)
  }
}

export default withAuth(handler)
