import { NextApiRequest, NextApiResponse } from 'next'

const licenses = [
  {
    id: 0,
    metadata: {
      type: '1',
      name: 'D'
    }
  },
  {
    id: 1,
    metadata: {
      type: '2',
      name: 'C'
    }
  },
  {
    id: 2,
    metadata: {
      type: '3',
      name: 'B'
    }
  }
]
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(licenses.find((a) => a.id.toString() === (req.query.tokenId as string)))
}
export default handler
