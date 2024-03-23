import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const response = await ivaoInstance.get('/v2/users/me', {
        headers: {
          Authorization: req.headers.authorization
        }
      })

      res.status(200).send(response.data)
    } catch (err) {
      const error = err as AxiosError<{ status: number }>
      console.log(error.response?.status)
      res.status(error.response?.data?.status ?? 400).send(error.response?.data)
    }
    return
  }
  res.status(405).end()
}

// http://localhost:3000/api/ivao/authorize

export default handler
