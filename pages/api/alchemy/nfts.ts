import { nftAircraftTokenAddress } from 'contracts/address'
import alchemy from 'lib/alchemy'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const response = await alchemy.nft.getNftsForContract(nftAircraftTokenAddress)
      res.status(200).send(response)
      return
    } catch (error) {
      res.status(400).send(error)
      return
    }
  }
  res.status(405).end()
}

export default withAuth(handler)
