import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }
  if (!req.headers['x-ivao-auth']) {
    res.status(403).end()
    return
  }

  if (typeof req.query.userId !== 'string') {
    res.status(406).end()
    return
  }

  return ivaoInstance
    .get(`/v2/tracker/sessions?userId=${req.query.userId}`, {
      headers: {
        Authorization: `Bearer ${req.headers['x-ivao-auth']}`
      }
    })
    .then((response) => {
      res.status(200).send(response.data)
    })
    .catch((err: AxiosError) => {
      console.error('error =>', err.response?.data)
      res.status(400).send(err.response?.data)
    })
}

export default handler
