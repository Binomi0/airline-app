import { connectDB } from 'lib/mongoose'
import withAuth from 'lib/withAuth'
import Live from 'models/Live'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const cargo = req.body

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

export default withAuth(handler)
