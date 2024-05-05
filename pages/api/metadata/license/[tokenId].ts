import { NFT } from '@thirdweb-dev/sdk'
import { NextApiRequest, NextApiResponse } from 'next'

const licenses: NFT[] = [
  {
    owner: '0x0000000000',
    type: 'ERC1155',
    supply: '100',
    metadata: {
      id: '0',
      price: 0,
      description:
        'This is a license that does not require experience or previous knowledge of aeronautics, thanks to this license you will be able to fly light recreational aircraft with a maximum weight. If you are looking for a hobby as exciting as flying, this could be your best option. Within this division we can find different options.',
      name: 'LIGHT AVIATION PILOT LICENSE - LAPL',
      image: 'https://bafybeidukuypx2wjofxdd24gskzervy7yropenlg5v3nq7y44uauu5a6qa.ipfs.cf-ipfs.com/',
      uri: 'http://localhost:3000/api/metadata/license/0',
      attributes: [
        {
          trait_type: 'type',
          value: '1'
        },
        {
          trait_type: 'name',
          value: 'D'
        },
        {
          trait_type: 'icao',
          value: 'LAPL'
        },
        {
          trait_type: 'price',
          value: '0'
        }
      ]
    }
  },
  {
    owner: '0x0000000000',
    type: 'ERC1155',
    supply: '100',
    metadata: {
      id: '1',
      price: 10,
      description:
        'This is the licence that will allow you to fly aircraft not intended for commercial exploitation, for private purposes, i.e. not for profit. It is the first step to follow if your objective is to become a commercial pilot. You can start the course at the age of 16 years old and you must be 17 years old to be able to take the exam.',
      name: 'PRIVATE PILOT LICENCE - PPL(A)',
      image:
        'https://84aa8a0eeef8c5e1c6dce51ceac353e9.ipfscdn.io/ipfs/bafybeigzba4h3xi3ukik6yenxjk2roitzhzjmygah6v2zwqzsv4nyzb2vy/',
      uri: 'http://localhost:3000/api/metadata/license/1',
      attributes: [
        {
          trait_type: 'type',
          value: '2'
        },
        {
          trait_type: 'name',
          value: 'C'
        },
        {
          trait_type: 'icao',
          value: 'PPL'
        },
        {
          trait_type: 'price',
          value: '10'
        }
      ]
    }
  },
  {
    owner: '0x0000000000',
    type: 'ERC1155',
    supply: '100',
    metadata: {
      id: '2',
      price: 50,
      description:
        'Upon completion of the Modular Commercial Airplane Pilot Course, CPL(A), you will be able to fly aircraft as pilot in command or co-pilot of any aircraft engaged in operations other than commercial air transport, act as pilot in command in commercial air transport of any single-pilot aircraft and/or act as co-pilot in commercial air transport subject to specific restrictions according to the regulations in force.',
      name: 'COMMERCIAL PILOTO LICENCE - CPL (A)',
      image:
        'https://84aa8a0eeef8c5e1c6dce51ceac353e9.ipfscdn.io/ipfs/bafybeiaatluewsnldaaltea2lfyvdfmc24zp4mot3c4273laoutow7web4/',
      uri: 'http://localhost:3000/api/metadata/license/2',
      attributes: [
        {
          trait_type: 'type',
          value: '3'
        },
        {
          trait_type: 'name',
          value: 'B'
        },
        {
          trait_type: 'icao',
          value: 'CPL'
        },
        {
          trait_type: 'price',
          value: '50'
        }
      ]
    }
  },
  {
    owner: '0x0000000000',
    type: 'ERC1155',
    supply: '100',
    metadata: {
      id: '3',
      price: 100,
      description:
        'License with which you will be able to act as pilot in command (PIC) or co-pilot of any aircraft dedicated to operations other than commercial air transport; act as pilot in command in commercial air transport operations in any aircraft certified for a single pilot and act as co-pilot in commercial air transport of airlines. The program is developed in stages following different modules from less to more complex, obtaining upon completion the Commercial Pilot License CPL(A) and ATPL(A) Frozen.',
      name: 'AIRLINE TRANSPORT PILOT LICENCE - (ATPL FROZEN)',
      image:
        'https://84aa8a0eeef8c5e1c6dce51ceac353e9.ipfscdn.io/ipfs/bafybeiblucu74udzmx7irrvcudy76vmuhuti7bncaj2rymdd5sglimm7na/',
      uri: 'http://localhost:3000/api/metadata/license/3',
      attributes: [
        {
          trait_type: 'type',
          value: '4'
        },
        {
          trait_type: 'name',
          value: 'A'
        },
        {
          trait_type: 'icao',
          value: 'ATPL'
        },
        {
          trait_type: 'price',
          value: '100'
        }
      ]
    }
  }
]

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(licenses.find((a) => a.metadata.id === (req.query.tokenId as string)))
}

export default handler
