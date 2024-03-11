import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Cargo from 'models/Cargo'
import { NextApiResponse } from 'next'
import { CargoStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const cargo = await Cargo.findOne({ userId: req.id, status: CargoStatus.STARTED })

      if (!cargo) {
        res.status(204).end()
        return
      }

      res.status(200).send(cargo)
    } catch (err) {
      console.error('GET /api/cargp error =>', err)
      res.status(400).send(err)
    }
  } else if (req.method === 'DELETE') {
    try {
      const current = await Cargo.findOneAndDelete({ userId: req.id, status: CargoStatus.STARTED })
      if (current) {
        res.status(202).end()
        return
      }
      res.status(204).end()
      return
    } catch (err) {
      console.error('post /api/cargp error =>', err)
      res.status(400).send(err)
      return
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
