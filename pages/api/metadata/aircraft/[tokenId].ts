import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('query =>', req.query)

  res.status(200).send({ metadata: { type: '1', aircraft: 'C-172' } })
}
export default handler
