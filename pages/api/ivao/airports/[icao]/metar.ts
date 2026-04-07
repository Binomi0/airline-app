import { AxiosError } from 'axios'
import { ivaoInstance } from 'config/axios'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'

/**
 * @description Handles request for metar ICAO codes
 *
 * @param req CustomNextApiRequest
 * @param res NextApiResponse
 * @returns {string} metar information
 */
const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  const options = {
    headers: {
      Authorization: req.headers['x-ivao-auth']
    }
  }

  try {
    const { data } = await ivaoInstance.get<{ metar: string; airportIcao: string }>(
      `/v2/airports/${req.query.icao}/metar`,
      options
    )

    if (data.metar) {
      res.status(200).send(data.metar)
      return
    }
    res.status(400).end()
  } catch (err) {
    const error = err as AxiosError<{ message: string }>
    if (error.response?.data.message === 'Unauthorized') {
      res.status(error.response.status).send(error.response.data)
      return
    }
    console.error(err)
    res.status(400).send(error.message)
  }
}

export default withAuth(handler)
