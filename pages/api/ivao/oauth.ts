import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const request = {
      grant_type: 'client_credentials',
      // code: '1111',
      // redirect_uri: 'http://localhost:3000',
      client_id: process.env.NEXT_PUBLIC_IVAO_ID,
      client_secret: process.env.IVAO_SECRET,
      // refresh_token: '',
      // password: '',
      // username: '',
      scope:
        'flight_plans:write openid supervisor profile discord location flight_plans:read configuration bookings:read tracker training friends:write friends:read email birthday bookings:write'
      // code_verifier: '',
      // nonce: ''
    }

    try {
      const { data } = await ivaoInstance.post('v2/oauth/token', request)

      if (!data) {
        res.status(204).send(data)
        return
      }

      ivaoInstance.defaults.headers.common.Authorization = `Bearer ${data.access_token}`

      res.status(200).send(data.access_token)
      return
    } catch (error) {
      const err = error as AxiosError
      console.error('IVAO OAUTH', err.response?.data)
      res.status(500).send(err)
      return
    }
  }

  res.status(405).end()
}

export default handler
