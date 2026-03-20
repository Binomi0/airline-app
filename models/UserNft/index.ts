import { mongoose } from 'lib/mongoose'
import { INft } from 'models/Nft'
import { Document } from 'mongoose'

export interface IUserNft extends Document {
  user: mongoose.Schema.Types.ObjectId
  nft: mongoose.Schema.Types.ObjectId
  address: string
  tokenId: bigint | string
  tokenAddress: string
  chainId: number
}

export type IUserNftPopulated = IUserNft & { nft: INft }

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
      transform: (_doc: IUserNft, ret: Record<string, unknown>) => {
        const r = ret as { tokenId: bigint | string }
        if (typeof r.tokenId === 'bigint') r.tokenId = r.tokenId.toString()
        return r
      }
    },
    toObject: {
      transform: (_doc: IUserNft, ret: Record<string, unknown>) => {
        const r = ret as { tokenId: bigint | string }
        if (typeof r.tokenId === 'bigint') r.tokenId = r.tokenId.toString()
        return r
      }
    }
  }
)

export default mongoose.models.UserNft || mongoose.model<IUserNft>('UserNft', userNftSchema)
