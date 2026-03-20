import { NextApiRequest, NextApiResponse } from 'next'

const licenses = [
  {
    id: 0,
    price: 0,
    metadata: {
      image: 'https://bafybeidukuypx2wjofxdd24gskzervy7yropenlg5v3nq7y44uauu5a6qa.ipfs.cf-ipfs.com/',
      type: '1',
      name: 'D'
    }
  },
  {
    id: 1,
    price: 10,
    metadata: {
      type: '2',
      name: 'C'
    }
  },
  {
    id: 2,
    price: 50,
    metadata: {
      type: '3',
      name: 'B'
    }
  },
  {
    id: 3,
    price: 100,
    metadata: {
      type: '4',
      name: 'A'
    }
  }
]

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(licenses.find((a) => a.id.toString() === (req.query.tokenId as string)))
}

export default handler
