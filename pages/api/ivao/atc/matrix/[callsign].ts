import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { ActiveAtc } from 'types'
import { reduceAtcTower, reduceTowerMatrix } from 'utils'

/** Reduce and remove duplicated towers */
// const reduceAtcTower = (acc: ActiveAtc[], curr: ActiveAtc) =>
//   acc.some((c) => c?.callsign.split('_')[0] === curr.callsign.split('_')[0])
//     ? acc
//     : curr.callsign.includes('_TWR')
//     ? [...acc, curr]
//     : acc

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const { data: atcs } = await ivaoInstance.get<ActiveAtc[]>('/v2/tracker/now/atc')
    const towers = atcs.reduce(reduceAtcTower, [])
    const result = atcs.reduce(reduceTowerMatrix(towers), [])

    console.log('CALLSIGN =>', req.query.callsign)

    const currentMatrix = result.find((current) => Boolean(current[req.query.callsign as string]))
    if (!currentMatrix) {
      res.status(204).end({ result })
      return
    }

    res.status(200).send(currentMatrix[req.query.callsign as string] ?? [])
  } catch (err) {
    const error = err as AxiosError<{ message: string }>
    if (error.response?.data.message === 'Unauthorized') {
      res.status(401).send(error.response.data)
      return
    }
    console.log(err)
    res.status(400).send(error.message)
  }
}

export default withAuth(handler)
