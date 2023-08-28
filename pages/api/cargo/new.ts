import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Cargo from 'models/Cargo'
import CargoDetails from 'models/Cargo/CargoDetails'
import Live from 'models/Live'
// import Live from 'models/Live'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const cargo = req.body

  try {
    await connectDB()
    const current = await Cargo.findOne({ userId: req.id })

    if (current) {
      res.status(202).send(current)
      return
    }

    // TODO: Remove when al cargo details are inserted in db
    let details = await CargoDetails.findOne({ name: cargo.details.name })
    if (!details) {
      details = await CargoDetails.create(cargo.details)
    }

    const currentCargo = await Cargo.findOne({ userId: req.id })
    if (!currentCargo) {
      const newCargo = await Cargo.create({
        ...cargo,
        userId: req.id,
        details: details._id
      })

      res.status(201).send(newCargo)
      return
    }

    res.status(202).send(currentCargo)
  } catch (error) {
    console.error('New Cargo ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
