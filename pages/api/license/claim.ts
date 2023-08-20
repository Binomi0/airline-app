import alchemy from 'lib/alchemy'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const response = await alchemy.core.getTokenBalances(req.body.address, [req.body.token])

    return res.status(200).send(response)
  } catch (error) {
    console.log('error =>', error)
    return res.status(500).json(error)
  }
}

export default handler