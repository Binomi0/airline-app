import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { PilotModel } from 'models'
import { Pilot } from 'models/Pilot'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const pilots = await PilotModel.find<Pilot>({})

      res.status(200).send(pilots)
    } catch (err) {
      res.status(500).send({ error: err, message: 'White searching for pilots' })
    }
  } else if (req.method === 'POST') {
    try {
      const response = await axios.get('https://api.ivao.aero/v2/tracker/now/pilots')
      console.log(response.data)
    } catch (err) {
      res.status(400).send(err)
      return
    }
  }
  res.status(405).end()
}

export default withAuth(handler)
