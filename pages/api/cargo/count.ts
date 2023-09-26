import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Cargo from 'models/Cargo'
import { NextApiResponse } from 'next'
import { CargoStatus } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const cargo = await Cargo.aggregate([
        {
          $match: {
            status: { $regex: CargoStatus.COMPLETED } // Case-insensitive regex search for the word
          }
        },
        {
          $group: {
            _id: null, // Group by null to count all matching documents as one group
            count: { $sum: 1 } // Increment the count for each matched document
          }
        },
        {
          $project: {
            _id: 0, // Exclude the _id field from the result
            count: 1 // Include only the count field in the result
          }
        }
      ])

      if (!cargo) {
        res.status(204).end()
        return
      }

      res.status(200).send(cargo)
    } catch (err) {
      console.error('GET /api/cargp error =>', err)
      res.status(400).send(err)
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
