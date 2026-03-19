import { ivaoInstance } from 'config/axios'
import { VirtualAirlineModel } from 'models'
import moment from 'moment'

interface IvaoTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

/**
 * Gets a valid IVAO access token for a user.
 * If the current token is expired, it attempts to refresh it.
 */
export const getIvaoToken = async (userId: string): Promise<string | null> => {
  const va = await VirtualAirlineModel.findOne({ userId })
  if (!va || !va.accessToken) {
    return null
  }

  // Check if token is expired (with 5 minute buffer)
  const isExpired = !va.tokenExpiry || moment(va.tokenExpiry).isBefore(moment().add(5, 'minutes'))

  if (!isExpired) {
    return va.accessToken
  }

  if (!va.refreshToken) {
    console.warn(`[IVAO Utils] Token expired for user ${userId} but no refresh token available.`)
    return null
  }

  try {
    console.info(`[IVAO Utils] Refreshing token for user ${userId}`)
    const response = await ivaoInstance.post<IvaoTokenResponse>('/v2/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: va.refreshToken,
      client_id: process.env.NEXT_PUBLIC_IVAO_ID,
      client_secret: process.env.IVAO_SECRET
    })

    const { access_token, refresh_token, expires_in } = response.data

    // Update DB with new tokens
    va.accessToken = access_token
    va.refreshToken = refresh_token
    va.tokenExpiry = moment().add(expires_in, 'seconds').toDate()
    await va.save()

    return access_token
  } catch (error) {
    console.error(`[IVAO Utils] Failed to refresh token for user ${userId}:`, error)
    return null
  }
}

/**
 * Perform a "System" login using client_credentials.
 * Returns the token instead of setting it globally.
 */
export const getSystemIvaoToken = async (): Promise<string | null> => {
  try {
    const response = await ivaoInstance.post<IvaoTokenResponse>('/v2/oauth/token', {
      grant_type: 'client_credentials',
      client_id: process.env.NEXT_PUBLIC_IVAO_ID,
      client_secret: process.env.IVAO_SECRET,
      scope: 'flight_plans:read tracker'
    })

    return response.data.access_token
  } catch (error) {
    console.error('[IVAO Utils] Failed to get system token:', error)
    return null
  }
}
