import { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '../auth/[...thirdweb]'
import clientPromise from 'lib/mongodb'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end()
  const user = await getUser(req)

  if (!user) {
    return res.status(401).json({
      message: 'Not authorized.'
    })
  }
  try {
    const client = await clientPromise
    const db = client.db('cargo').collection('live')
    const cargo = await db.findOne({ address: user.address })

    return res.json(cargo)
  } catch (e) {
    console.error(e)
    return res.status(500).end('ERROR')
  }
}

export default handler
