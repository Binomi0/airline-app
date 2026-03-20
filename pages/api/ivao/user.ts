import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import { NextApiResponse } from 'next'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { getIvaoToken } from 'utils/ivao'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      // 1. Try to get token from DB
      let token = await getIvaoToken(req.userId!)

      // 2. Fallback to header (for seamless migration)
      if (!token && req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '')
      }

      if (!token) {
        return res.status(401).json({ message: 'No IVAO session found' })
      }

      const response = await ivaoInstance.get('/v2/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      res.status(200).send(response.data)
    } catch (err) {
      const error = err as AxiosError<{ status: number }>
      console.error('[IVAO User API]', error.response?.status, error.message)
      res.status(error.response?.status ?? 400).send(error.response?.data)
    }
    return
  }
  res.status(405).end()
}

export default withAuth(handler)
