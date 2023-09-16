import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send({ metadata: { type: '1', license: 'D' } })
}
export default handler
