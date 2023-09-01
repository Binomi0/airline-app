import axios from 'config/axios'
import { IVAOClients } from 'context/VaProvider/VaProvider.types'
import withAuth from 'lib/withAuth'
import moment, { Moment } from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'

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
