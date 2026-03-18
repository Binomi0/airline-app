import { ivaoInstance } from 'config/axios'
import { connectDB } from 'lib/mongoose'
import { UserModel, VirtualAirlineModel } from 'models'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    console.log('req.query =>', req.query)
    if (!req.query.state || !req.query.code) {
      if (req.query.error_description) {
        return res.status(400).send(req.query.error_description)
        // TODO: Redirect to IVAO page with error message
        // IF error_description = User+is+Inactive+User => Show message: "Your IVAO account is inactive. Please contact IVAO support to activate your account."
        // ELSE => Show message: "An error has occurred while connecting to IVAO. Please try again."
      }

      return res.status(400).end()
    }

    const body = {
      // code: req.query.code,
      // code_verifier: req.query.code_verifier,
      // state: req.query.state,
      grant_type: 'client_credentials',
      scope: 'openid profile location flight_plans:read configuration tracker training email birthday',
      client_id: process.env.NEXT_PUBLIC_IVAO_ID,
      client_secret: process.env.IVAO_SECRET
      // redirect_uri: process.env.NEXT_PUBLIC_IVAO_REDIRECT_URI
    }

    let accessToken
    try {
      const response = await ivaoInstance.post<{ access_token?: string }>('/v2/oauth/token', body, {
        headers: { Authorization: `Bearer ${req.query.code}` }
      })

      if (!response.data) {
        res.status(404).end()
        return
      }

      accessToken = response.data.access_token
      console.log('response =>', response.data)
    } catch (error) {
      console.error('Error getting token =>', error)
      res.status(500).send(error)
      return
    }

    // FIXME: Missing state and challenge validation

    const decoded = jwt.decode(req.query.code as string, { json: true, complete: true })
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
      const va = await VirtualAirlineModel.findOne({ userId: req.query.state })
      if (va) {
        return res.status(200).json(accessToken)
      }

      const vaUser = await VirtualAirlineModel.findOneAndUpdate(
        { userId: req.query.state },
        { isVerified: true, pilotId: decoded.payload.sub },
        { upsert: true, returnDocument: 'after' }
      )
      try {
        await UserModel.findOneAndUpdate({ userId: req.query.state }, { vaUser: vaUser._id })
        console.log('User updated vaUser')
      } catch (err) {
        console.error('Updating user', vaUser._id, err)
        console.log('Error al actualizar el usuario', req.query.state)
        res.status(406).end()
        return
      }
    } catch (error) {
      console.log('Error updating virtual airline user', error)
      res.status(400).send(error)
      return
    }
    // res.redirect(`/ivao?token=${req.query.code}`)
    return res.status(200).json(accessToken)
  } else {
    res.status(405).end()
  }

  res.status(401).end()
}

export default handler
