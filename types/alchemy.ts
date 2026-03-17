export interface AlchemyOpenSeaMetadata {
  floorPrice: number | null
  collectionName: string
  safelistRequestStatus: string
  imageUrl: string
  description: string
  externalUrl: string
  twitterUsername: string | null
  discordUrl: string | null
  lastIngestedAt: string
}

export interface AlchemyNftContract {
  address: string
  name: string
  symbol: string
  totalSupply: string | null
  tokenType: 'ERC721' | 'ERC1155'
  contractDeployer: string
  deployedBlockNumber: number
  openSeaMetadata: AlchemyOpenSeaMetadata
  isSpam: boolean | null
  spamClassifications: string[]
}

export interface AlchemyNftImage {
  cachedUrl: string | null
  thumbnailUrl: string | null
  pngUrl: string | null
  contentType: string | null
  size: number | null
  originalUrl: string | null
}

export interface AlchemyNftAttribute {
  value: string | number
  trait_type: string
}

export interface AlchemyNftRawMetadata {
  name?: string
  description?: string
  image?: string
  external_url?: string
  attributes?: AlchemyNftAttribute[]
  [key: string]: unknown // To allow for other dynamic properties in metadata
}

export interface AlchemyOwnedNft {
  contract: AlchemyNftContract
  tokenId: string
  tokenType: 'ERC721' | 'ERC1155'
  name: string | null
  description: string | null
  image: AlchemyNftImage
  raw: {
    tokenUri: string | null
    metadata: AlchemyNftRawMetadata
    error: string | null
  }
  tokenUri: string | null
  timeLastUpdated: string
  balance: string
}

export interface AlchemyOwnedNftsResponse {
  ownedNfts: AlchemyOwnedNft[]
  totalCount: number
  validAt: {
    blockNumber: number
    blockHash: string
    blockTimestamp: string
  }
  pageKey: string | null
}
