import { ivaoInstance } from 'config/axios'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { ActiveAtc } from 'types'
import { reduceTowerMatrix } from 'utils'

/** Reduce and remove duplicated towers */
const reduceAtcTower = (acc: ActiveAtc[], curr: ActiveAtc) =>
  acc.some((c) => c?.callsign.split('_')[0] === curr.callsign.split('_')[0])
    ? acc
    : curr.callsign.includes('_TWR')
    ? [...acc, curr]
    : acc

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  async function getAtcs() {
    const { data } = await ivaoInstance.get<ActiveAtc[]>('/v2/tracker/now/atc')
    return data
  }

  async function getAtcTowers(): Promise<ActiveAtc[]> {
    const data = await getAtcs()

    return data.reduce(reduceAtcTower, [])
  }
  async function getCurrentMatrix() {
    const atcs = await getAtcTowers()

    const result = atcs.reduce(reduceTowerMatrix(atcs), [])

    return result
  }

  async function getDestinationsForAirport(airport: string) {
    const currentMatrix = await getCurrentMatrix()
    const result = currentMatrix.find((current) => Boolean(current[airport]))
    if (!result) return []

    return result[airport] ?? []
  }

  res.status(200).send(await getDestinationsForAirport(req.query.callsign as string))
}

export default withAuth(handler)
