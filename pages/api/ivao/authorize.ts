import { ivaoInstance } from 'config/axios'
import { connectDB } from 'lib/mongoose'
import { UserModel, VirtualAirlineModel } from 'models'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { AxiosError } from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const state = (Array.isArray(req.query.state) ? req.query.state[0] : req.query.state) as string
    const code = (Array.isArray(req.query.code) ? req.query.code[0] : req.query.code) as string

    interface IvaoTokenBody {
      grant_type: string
      code: string
      client_id: string
      client_secret: string
      redirect_uri?: string
      code_verifier?: string
    }

    const body: IvaoTokenBody = {
      grant_type: 'authorization_code',
      code: code as string,
      client_id: process.env.NEXT_PUBLIC_IVAO_ID!,
      client_secret: process.env.IVAO_SECRET!,
      code_verifier: 'dXNlci5pZA'
    }

    if (process.env.NEXT_PUBLIC_IVAO_REDIRECT_URI) {
      body.redirect_uri = process.env.NEXT_PUBLIC_IVAO_REDIRECT_URI
    }

    let tokenData
    try {
      const response = await ivaoInstance.post<{
        access_token: string
        refresh_token: string
        expires_in: number
      }>('/v2/oauth/token', body, {
        headers: { Authorization: `Bearer ${code}` }
      })

      if (!response.data || !response.data.access_token) {
        res.status(404).send('Token not found in IVAO response')
        return
      }

      tokenData = response.data
    } catch (error) {
      console.error('[IVAO Authorize] Error exchanging code =>', error)
      const axiosError = error as AxiosError
      return res.status(500).json({
        error: 'exchange_failed',
        details: axiosError.response?.data || axiosError.message
      })
    }

    const decoded = jwt.decode(tokenData.access_token, { json: true, complete: true })

    if (!decoded || !decoded.payload || typeof decoded.payload === 'string' || !decoded.payload.sub) {
      console.error('[IVAO Authorize] Invalid code payload or missing sub. Payload:', decoded?.payload)
      res.status(403).send('Invalid identity code')
      return
    }

    try {
      await connectDB()

      const expiryDate = new Date()
      expiryDate.setSeconds(expiryDate.getSeconds() + (tokenData.expires_in || 3600))

      const vaUser = await VirtualAirlineModel.findOneAndUpdate(
        { userId: state },
        {
          isVerified: true,
          type: 'IVAO',
          pilotId: decoded.payload.sub,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiry: expiryDate
        },
        { upsert: true, returnDocument: 'after' }
      )

      if (vaUser?._id) {
        await UserModel.findOneAndUpdate({ userId: state }, { vaUser: vaUser._id })
      }

      console.log('[IVAO Authorize] Process finished successfully.')
      return res.status(200).json(tokenData.access_token)
    } catch (error) {
      console.error('[IVAO Authorize] CRITICAL ERROR IN DB PHASE:', error)
      res.status(400).send(error)
      return
    }
  } else {
    res.status(405).end()
  }
}

export default handler
