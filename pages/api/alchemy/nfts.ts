import { NftMetadataBatchToken, NftTokenType } from 'alchemy-sdk'
import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import alchemy from 'lib/alchemy'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'

const aircrafts: NftMetadataBatchToken[] = [
  {
    contractAddress: nftAircraftTokenAddress,
    tokenId: '0',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftAircraftTokenAddress,
    tokenId: '1',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftAircraftTokenAddress,
    tokenId: '2',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftAircraftTokenAddress,
    tokenId: '3',
    tokenType: NftTokenType.ERC1155
  }
]

const licenses: NftMetadataBatchToken[] = [
  {
    contractAddress: nftLicenseTokenAddress,
    tokenId: '0',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftLicenseTokenAddress,
    tokenId: '1',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftLicenseTokenAddress,
    tokenId: '2',
    tokenType: NftTokenType.ERC1155
  },
  {
    contractAddress: nftLicenseTokenAddress,
    tokenId: '3',
    tokenType: NftTokenType.ERC1155
  }
]
const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      console.log('NFTS')
      // const response = await alchemy.nft.getNftsForContract(nftAircraftTokenAddress)
      const response = await alchemy.nft.getNftMetadataBatch([...aircrafts, ...licenses])
      res.status(200).send(response)
      return
    } catch (error) {
      console.log('NFTS ERROR', error)
      res.status(400).send(error)
      return
    }
  }
  res.status(405).end()
}

export default withAuth(handler)
