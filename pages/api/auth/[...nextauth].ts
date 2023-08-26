import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise, { db } from 'lib/mongodb'
import { Collection } from 'types'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { deleteCookie, getCookie } from 'cookies-next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise
  const collection = client.db(db).collection(Collection.user)

  try {
    const token = getCookie('token', { req, res })
    if (!token) {
      res.status(401).end()
      return
    }
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload

    if (decoded.data.email) {
      const user = await collection.findOne({ email: decoded.data.email })

      res.status(200).send({ user, token })
      return
    } else {
      res.status(400).end()
      return
    }
  } catch (err) {
    // @ts-ignore
    if (err?.message === 'jwt expired') {
      deleteCookie('token', { req, res })
      res.status(401).end()
      return
    }
    res.status(500).send(err)
  }
}
export default handler
