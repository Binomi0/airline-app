import { ivaoInstance } from 'config/axios'
import { VirtualAirlineModel, AtcHistoryModel } from 'models'
import moment from 'moment'

/**
 * Calculates the average ATC connection duration.
 * @param icao Optional airport ICAO to filter stats.
 * @returns Average duration in minutes.
 */
export const getAverageAtcDuration = async (icao?: string): Promise<number> => {
  try {
    const query = icao ? { airportIcao: icao.toUpperCase() } : {}

    const stats = await AtcHistoryModel.aggregate([
      { $match: query },
      { $group: { _id: null, avgDuration: { $avg: '$durationMinutes' } } }
    ])

    return stats.length > 0 ? Math.round(stats[0].avgDuration) : 120 // Default 2 hours if no data
  } catch (error) {
    console.error('[IVAO Utils] Error calculating average duration:', error)
    return 120
  }
}

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
