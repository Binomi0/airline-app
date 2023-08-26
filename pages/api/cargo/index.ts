import { NextApiRequest, NextApiResponse } from 'next'
// import { getUser } from '../auth/[...nextauth]'
import clientPromise, {db} from 'lib/mongodb'
import { Collection } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end()
  // const user = await getUser(req)

  // if (!user) {
  //   return res.status(401).json({
  //     message: 'Not authorized.'
  //   })
  // }
  try {
    const client = await clientPromise
    const collection = client.db(db).collection(Collection.live)
    const cargo = await collection.findOne({ address: 'user.address' })

    return res.json(cargo)
  } catch (e) {
    console.error(e)
    return res.status(500).end('ERROR')
  }
}

export default handler
