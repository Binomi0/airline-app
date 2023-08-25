import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { deleteCookie, getCookie } from 'cookies-next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise
  const db = client.db(DB.develop).collection(Collection.user)

  try {
    const token = getCookie('token', { req, res })
    if (!token) res.status(401).end()
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload

    if (decoded.data.email) {
      const user = await db.findOne({ email: decoded.data.email })

      res.status(200).send({ user, token })
    } else {
      res.status(400).end()
    }
  } catch (err) {
    // @ts-ignore
    if (err?.message === 'jwt expired') {
      deleteCookie('token', {req, res})
      res.status(401).end()
    }
    res.status(500).send(err)
  }

  try {
    const token = req.headers.Authorization as string
    if (token) {
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET) as JwtPayload
      if (decoded.data.email) {
        const user = await db.findOne({ email: decoded.data.email })

        res.status(200).send({ user, token })
      }
    }
  } catch (err) {
    console.log('JWT', err  )
    res.status(500).send(err)
  }

  res.status(401).end()
}
export default handler
