import axios from 'config/axios'
import { IVAOClients } from 'context/VaProvider/VaProvider.types'
import withAuth from 'lib/withAuth'
import Atcs from 'models/Atc'
import moment, { Moment } from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import { Atc } from 'types'

let nextCall: Moment
let clients: { pilots: IVAOClients[]; atcs: IVAOClients[] }[]

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }
  const now = moment()

  if (!nextCall || nextCall.isBefore(now)) {
    nextCall = now.add(20, 'seconds')
    try {
      console.info('requesting IVAO data at %s', now.format('HH:mm:ss'))

      const response = await axios.get('https://api.ivao.aero/v2/tracker/whazzup')

      if (response.data.clients.atcs) {
        const { atcs } = response.data.clients
        try {
          atcs.forEach(async (atc: Atc) => {
            await Atcs.findOneAndUpdate({ callsign: atc.callsign }, atc, { upsert: true })
          })
        } catch (error) {
          console.error('ERROR =>', error)
        }
      }
      if (!response.data.clients.pilots) {
        res.status(202).send(clients)
        return
      }
      clients = response.data.clients

      res.status(200).send(response.data.clients)
      return
    } catch (error) {
      console.error('error =>', error)
      res.status(500).send([])
      return
    }
  }
  res.status(202).send(clients)
}

export default withAuth(handler)
