import { mongoose } from 'lib/mongoose'
import { NFT } from 'thirdweb'
import { Document } from 'mongoose'

export interface INft extends Document, Omit<NFT, 'id' | 'supply'> {
  id: bigint | string
  supply?: bigint | string
}

const nftSchema: mongoose.Schema = new mongoose.Schema(
  {
    metadata: {
      uri: { type: String, required: true },
      name: { type: String },
      description: { type: String },
      image: { type: String },
      animation_url: { type: String },
      external_url: { type: String },
      background_color: { type: String },
      properties: { type: mongoose.Schema.Types.Mixed },
      attributes: { type: mongoose.Schema.Types.Mixed },
      image_url: { type: String }
    },
    owner: { type: String, default: null },
    id: { type: BigInt, required: true },
    tokenURI: { type: String, required: true },
    type: { type: String, enum: ['ERC721', 'ERC1155'], required: true },
    tokenAddress: { type: String, required: true },
    chainId: { type: Number, required: true },
    supply: { type: BigInt }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: INft, ret: Record<string, unknown>) => {
        const r = ret as { id: bigint | string; supply?: bigint | string }
        if (typeof r.id === 'bigint') r.id = r.id.toString()
        if (typeof r.supply === 'bigint') r.supply = r.supply.toString()
        return r
      }
    },
    toObject: {
      transform: (_doc: INft, ret: Record<string, unknown>) => {
        const r = ret as { id: bigint | string; supply?: bigint | string }
        if (typeof r.id === 'bigint') r.id = r.id.toString()
        if (typeof r.supply === 'bigint') r.supply = r.supply.toString()
        return r
      }
    }
  }
)

export default mongoose.models.Nft || mongoose.model<INft>('Nft', nftSchema)
