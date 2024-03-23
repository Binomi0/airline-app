import { ivaoInstance } from 'config/axios'
import { connectDB } from 'lib/mongoose'
import { UserModel, VirtualAirlineModel } from 'models'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query)
  if (req.method === 'GET') {
    if (!req.query.state || !req.query.code) {
      res.status(400).end()
      return
    }
    const body = {
      grant_type: 'client_credentials',
      scope: 'openid profile location flight_plans:read configuration bookings:read tracker training email birthday',
      client_id: process.env.IVAO_ID,
      client_secret: process.env.IVAO_SECRET,
      // TODO: Receive redirect URL from env?
      redirect_url: 'http://localhost:3000/api/ivao/success'
    }

    const response = await ivaoInstance.post<{ access_token?: string }>('/v2/oauth/token', body, {
      headers: { Authorization: `Bearer ${req.query.code}` }
    })

    if (!response.data) {
      res.status(404).send(response.data)
      return
    }

    // Missing state and challenge validation
    ivaoInstance.defaults.headers.common.Authorization = `Bearer ${req.query.code}`
    const decoded = jwt.decode(req.query.code as string, { json: true, complete: true })
    console.log({ decoded })
    if (!decoded) {
      res.status(403).end()
      return
    }
    if (typeof decoded.payload === 'string') {
      res.status(400).send('Invalid jwt payload')
      return
    }

    console.log('code challenge =>', decoded.payload.pkce.codeChallenge)
    console.log('code method =>', decoded.payload.pkce.codeChallengeMethod)

    try {
      await connectDB()
      const vaUser = await VirtualAirlineModel.findOneAndUpdate(
        { userId: req.query.state },
        { isVerified: true, pilotId: decoded.payload.sub },
        { upsert: true }
      )
      await UserModel.findOneAndUpdate({ userId: req.query.state }, { vaUser: vaUser._id })
    } catch (error: any) {
      console.log('Error updating virtual airline user')
      res.status(400).send(error)
      return
    }
    res.redirect(`/ivao?token=${req.query.code}`)
    return
  } else {
    res.status(405).end()
  }

  ivaoInstance.defaults.headers.common.Authorization = ''

  res.status(401).end()
}

export default handler
