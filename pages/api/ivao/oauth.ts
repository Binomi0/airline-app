import { getSystemIvaoToken } from 'utils/ivao'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const token = await getSystemIvaoToken()

      if (!token) {
        return res.status(403).send('Failed to obtain IVAO system token')
      }

      return res.status(200).send(token)
    } catch (error) {
      console.error('IVAO OAUTH Error:', error)
      return res.status(500).send(error)
    }
  }

  res.status(405).end()
}

export default handler
