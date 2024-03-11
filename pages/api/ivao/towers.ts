import withAuth from 'lib/withAuth'
import Atcs from 'models/Atc'
import { NextApiRequest, NextApiResponse } from 'next'
import { Atc, FRoute, Flight } from 'types'

const reduceOthers = (origin: string, others: Atc[]): FRoute[] =>
  others.reduce((acc: FRoute[], curr: Atc) => {
    if (acc.some((ac) => ac.destination === curr.callsign.split('_')[0])) {
      return acc
    }
    return [
      ...acc,
      {
        origin,
        destination: curr.callsign.split('_')[0]
      }
    ]
  }, [] as FRoute[])

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }
  try {
    const query = req.query.callsign && { callsign: { $regex: req.query.callsign as string, $options: 'i' } }
    const atcs = await Atcs.find<Atc>(query ? query : { callsign: 'TWR' })

    const towers = atcs.filter((a) => a.callsign.includes('TWR'))

    const flights: Flight = towers.reduce((acc: Flight, curr: Atc) => {
      const others: Atc[] = towers.filter((t) => {
        return t.id !== curr.id && t.callsign.split('_')[0] !== curr.callsign.split('_')[0]
      })

      const origin = curr.callsign.split('_')[0]
      if (acc[origin]) {
        return acc
      }
      return {
        ...acc,
        [origin]: reduceOthers(origin, others)
      }
    }, {})

    res.status(200).send({ towers, flights })
  } catch (error) {
    console.error('error =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)