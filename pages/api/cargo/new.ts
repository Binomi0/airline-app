import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Cargo from 'models/Cargo'
import CargoDetails from 'models/Cargo/CargoDetails'
import { NextApiResponse } from 'next'
import { CargoStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const cargo = req.body

    try {
      await connectDB()
      const current = await Cargo.findOne({ userId: req.id, status: CargoStatus.STARTED })

      if (current) {
        res.status(202).send(current)
        return
      }

      // TODO: Remove when al cargo details are inserted in db
      let details = await CargoDetails.findOne({ name: cargo.details.name })
      if (!details) {
        details = await CargoDetails.create(cargo.details)
      }

      const newCargo = await Cargo.create({
        ...cargo,
        userId: req.id,
        details: details._id
      })

      res.status(201).send(newCargo)
      return
    } catch (error) {
      console.error('New Cargo ERROR =>', error)
      res.status(500).end()
      return
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
