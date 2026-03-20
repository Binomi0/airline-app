import { ivaoInstance } from 'config/axios'
import withAuth from 'lib/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'

interface AxiosErrorResponse {
  response?: {
    status: number
  }
  message: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const apiKey = process.env.IVAO_API_KEY

  console.log('[ATIS API] Fetching ATIS for session:', id)

  if (!id) {
    return res.status(400).json({ message: 'Session ID is required' })
  }

  if (!apiKey) {
    console.error('[ATIS API] IVAO_API_KEY is not configured')
    return res.status(500).json({ message: 'IVAO API key is missing in configuration' })
  }

  try {
    // Attempting to fetch from IVAO
    const response = await ivaoInstance.get(`/v2/tracker/sessions/${id}/atis/latest`, {
      headers: {
        apiKey: apiKey
      }
    })
    console.log('[ATIS API] Success for session:', id)
    res.status(200).json(response.data)
  } catch (error: unknown) {
    const axiosError = error as AxiosErrorResponse
    const status = axiosError.response?.status
    const message = axiosError.message
    console.error('[ATIS API] Error from IVAO:', status, message)

    // If IVAO returns 401, it might be a public endpoint issue or missing key
    res.status(status || 500).json({
      message: 'Error fetching ATIS from IVAO',
      details: message,
      status: status
    })
  }
}

export default withAuth(handler)
