import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'
import jwt, { JwtPayload } from 'jsonwebtoken'
import withAuth from 'lib/withAuth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end()

  const token = req.headers.Authorization as string
  if (token) {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET) as JwtPayload
    const { email } = decoded.data
    if (!email) {
      throw new Error('Missing email in token')
    }

    try {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)
      const user = await db.findOne({ email })

      return res.status(200).send(user)
    } catch (err) {
      return res.status(500).send(err)
    }
  }

  res.status(401).end()
}
export default withAuth(handler)
