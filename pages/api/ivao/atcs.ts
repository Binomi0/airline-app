import { mongoose } from 'lib/mongoose'
import withAuth from 'lib/withAuth'
import Atcs from 'models/Atc'
import { NextApiRequest, NextApiResponse } from 'next'
import { Atc } from 'types'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }
  try {
    const query = req.query.callsign ? { callsign: { $regex: req.query.callsign as string, $options: 'i' } } : {}
    const atcs = await Atcs.find<Atc>(query)

    res.status(200).send(atcs)
  } catch (error) {
    console.error('error =>', error)
    res.status(500).end()
  } finally {
    // await mongoose.disconnect()
  }
}

export default withAuth(handler)
