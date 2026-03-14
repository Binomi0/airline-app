import { mongoose } from 'lib/mongoose'
import { Document } from 'mongoose'

export interface IUserNft extends Document {
  user: mongoose.Schema.Types.ObjectId
  nft: mongoose.Schema.Types.ObjectId
  address: string
  tokenId: string
  tokenAddress: string
  chainId: number
}

const userNftSchema: mongoose.Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    nft: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nft',
      required: true
    },
    address: {
      type: String,
      required: true,
      index: true
    },
    tokenId: {
      type: BigInt,
      required: true
    },
    tokenAddress: {
      type: String,
      required: true,
      index: true
    },
    chainId: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        if (typeof ret.tokenId === 'bigint') ret.tokenId = ret.tokenId.toString()
        return ret
      }
    },
    toObject: {
      transform: (doc, ret) => {
        if (typeof ret.tokenId === 'bigint') ret.tokenId = ret.tokenId.toString()
        return ret
      }
    }
  }
)

export default mongoose.models.UserNft || mongoose.model<IUserNft>('UserNft', userNftSchema)
