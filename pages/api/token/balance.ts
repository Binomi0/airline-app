import alchemy from 'lib/alchemy'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }
  if (!req.body.address || !req.body.token) {
    res.status(400).send
    return
  }

  try {
    const response = await alchemy.core.getTokenBalances(req.body.address, [req.body.token])

    res.status(200).send(response)
  } catch (error) {
    console.error('error =>', error)
    res.status(400).send(error)
  }
}

export default withAuth(handler)
