import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { ActiveAtc } from 'types'
import { reduceAtcTower } from 'utils'
import Atcs from 'models/Atc'
import moment from 'moment'
import { syncAtcsWithGracePeriod } from 'lib/ivao-atc-sync'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.time('TOWER')
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const query = req.query.callsign ? { callsign: { $regex: req.query.callsign as string, $options: 'i' } } : {}
    const atcs = await Atcs.find<ActiveAtc>(query)

    if (atcs.length > 0) {
      const lastUpdate = moment(atcs[0].updatedAt)
      const now = moment()
      const needUpdate = now.diff(lastUpdate, 'minutes') >= 1

      if (!needUpdate) {
        console.timeEnd('TOWER')
        res.status(200).send(atcs)
        return
      }
    }
  } catch (error) {
    console.error('error =>', error)
  }

  const apiKey = process.env.NEXT_PUBLIC_IVAO_API_KEY
  const userToken = req.headers['x-ivao-token'] as string

  try {
    const headers: Record<string, string> = {}
    if (apiKey) headers['apiKey'] = apiKey
    if (userToken) headers['Authorization'] = userToken

    const { data } = await ivaoInstance.get<ActiveAtc[]>('/v2/tracker/now/atc', {
      timeout: 5000,
      headers
    })
    const towers = data.reduce(reduceAtcTower, [])

    // Use shared sync logic instead of local update/delete
    await syncAtcsWithGracePeriod(towers)

    // Return the latest from DB after sync to include statuses etc.
    const updatedAtcs = await Atcs.find({})
    
    console.timeEnd('TOWER')
    res.status(200).send(updatedAtcs)
  } catch (err) {
    const error = err as AxiosError<{ message: string }>
    if (error.response?.data.message === 'Unauthorized') {
      res.status(401).send(error.response.data)
      return
    } else if (error.code === 'ECONNABORTED') {
      res.status(402).end()
    }
    res.status(400).send(error.response?.data)
  }
}

export default withAuth(handler)
