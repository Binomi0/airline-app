import { connectDB } from 'lib/mongoose'
import Live from 'models/Live'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
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
    await connectDB()
    const current = await Live.findOne({ address: 'user.address' })

    if (current) {
      res.status(202).json(current)
      return
    }

    const newCargo = await Live.create(cargo)

    res.status(201).send(newCargo)
  } catch (error) {
    console.error('New Cargo ERROR =>', error)
    res.status(500).end()
  }
}

export default handler
