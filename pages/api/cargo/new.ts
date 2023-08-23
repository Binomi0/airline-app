import { NextApiHandler } from 'next'
// import { getUser } from '../auth/[...nextauth]'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  // const user = await getUser(req)

  // if (!user) {
  //   return res.status(401).json({
  //     message: 'Not authorized.'
  //   })
  // }

  const cargo = req.body

  // if (cargo.address !== user.address) {
  //   return res.status(400).end()
  // }

  try {
    const client = await clientPromise
    const db = client.db(DB.develop).collection(Collection.live)
    const current = await db.findOne({ address: 'user.address' })

    if (current) {
      return res.status(202).json(current)
    }

    const newCargo = await db.insertOne(cargo)

    return res.status(201).send(newCargo)
  } catch (error) {
    console.error('New Cargo ERROR =>', error)
    return res.status(500).end()
  }
}

export default handler
