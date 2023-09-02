import withAuth from 'lib/withAuth'
import Atcs from 'models/Atc'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }
  try {
    const query = req.query.callsign ? { callsign: { $regex: req.query.callsign as string, $options: 'i' } } : {}
    const atcs = await Atcs.find(query)
    res.status(200).send(atcs)
    return
  } catch (error) {
    console.error('error =>', error)
    res.status(500).end()
    return
  }
}

export default withAuth(handler)
