import { mongoose } from 'lib/mongoose'
import { NFT } from 'thirdweb'
import { Document } from 'mongoose'

export type INft = NFT & Document

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
      transform: (doc, ret) => {
        if (typeof ret.id === 'bigint') ret.id = ret.id.toString()
        if (typeof ret.supply === 'bigint') ret.supply = ret.supply.toString()
        return ret
      }
    },
    toObject: {
      transform: (doc, ret) => {
        if (typeof ret.id === 'bigint') ret.id = ret.id.toString()
        if (typeof ret.supply === 'bigint') ret.supply = ret.supply.toString()
        return ret
      }
    }
  }
)

export default mongoose.models.Nft || mongoose.model<INft>('Nft', nftSchema)
