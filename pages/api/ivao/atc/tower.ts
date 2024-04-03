import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { ActiveAtc } from 'types'
import { reduceAtcTower } from 'utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const { data } = await ivaoInstance.get<ActiveAtc[]>('/v2/tracker/now/atc')
    const towers = data.reduce(reduceAtcTower, [])
    res.status(200).send(towers)
  } catch (err) {
    const error = err as AxiosError<{ message: string }>
    if (error.response?.data.message === 'Unauthorized') {
      res.status(401).send(error.response.data)
      return
    }
    res.status(400).send(error.response?.data)
  }
}

export default withAuth(handler)
