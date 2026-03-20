import { isAxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { IvaoEvent } from 'types'
import { getSystemIvaoToken } from 'utils/ivao'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, division, airportIcao } = req.query

    // Try to get system token for authenticated request
    const token = await getSystemIvaoToken()

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    } else if (process.env.NEXT_PUBLIC_IVAO_API_KEY) {
      headers['apiKey'] = process.env.NEXT_PUBLIC_IVAO_API_KEY
    }

    const response = await ivaoInstance.get<IvaoEvent[]>('/v1/events', {
      headers,
      params: {
        title,
        division,
        airportIcao
      }
    })

    return res.status(200).json(response.data)
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('[IVAO Events API] Error fetching events:', error.message)
      return res.status(error.response?.status ?? 500).json({
        message: 'Error fetching events from IVAO',
        error: error.message
      })
    }
    console.error('[IVAO Events API] Unknown error:', error)
    return res.status(500).json({
      message: 'An unknown error occurred',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
