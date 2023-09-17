import { NextApiRequest, NextApiResponse } from 'next'

const aircrafts = [
  {
    id: 0,
    metadata: {
      type: '1',
      name: 'C-172'
    }
  },
  {
    id: 1,
    metadata: {
      type: '2',
      name: 'C-700'
    }
  },
  {
    id: 2,
    metadata: {
      type: '3',
      name: 'B737'
    }
  }
]

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('query =>', req.query)

  res.status(200).send(aircrafts.find((a) => a.id.toString() === (req.query.tokenId as string)))
}
export default handler
