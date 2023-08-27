import { connectDB } from 'lib/mongoose'
import Live from 'models/Live'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(405).end()
  // const user = await getUser(req)

  // if (!user) {
  //   return res.status(401).json({
  //     message: 'Not authorized.'
  //   })
  // }
  try {
    await connectDB()
    const cargo = await Live.findOne({ address: 'user.address' })

    return res.json(cargo)
  } catch (e) {
    console.error(e)
    return res.status(500).end('ERROR')
  }
}

export default handler
