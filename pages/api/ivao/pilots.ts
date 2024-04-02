import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import { PilotModel, VirtualAirlineModel } from 'models'
import { Pilot } from 'models/Pilot'
import { ivaoInstance } from 'config/axios'
import { IVirtualAirline } from 'models/VirtualAirline'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const virtualAirline = await VirtualAirlineModel.findOne<IVirtualAirline>({ userId: req.userId })
      if (!virtualAirline) {
        res.status(404).end()
        return
      }
      const pilot = await PilotModel.findOne<Pilot>({ userId: virtualAirline.pilotId })

      res.status(200).send(pilot)
    } catch (err) {
      res.status(500).send({ error: err, message: 'While searching for pilots' })
    }
  } else if (req.method === 'POST') {
    try {
      // TODO: Continue here
      await ivaoInstance.get('v2/tracker/now/pilots')
    } catch (err) {
      res.status(400).send(err)
      return
    }
  }
  res.status(405).end()
}

export default withAuth(handler)
