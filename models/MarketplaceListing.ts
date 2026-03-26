import { mongoose } from 'lib/mongoose'
import { Document } from 'mongoose'

export type ListingType = 'SALE' | 'RENT'
export type ListingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface IMarketplaceListing extends Document {
  nft: mongoose.Schema.Types.ObjectId
  seller: mongoose.Schema.Types.ObjectId
  buyer?: mongoose.Schema.Types.ObjectId
  price: string
  currency: 'AIRL' | 'AIRG'
  type: ListingType
  status: ListingStatus
  tokenId: string
  tokenAddress: string
  chainId: number
  expiresAt?: Date
}

const marketplaceListingSchema: mongoose.Schema = new mongoose.Schema(
  {
    nft: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nft',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      enum: ['AIRL', 'AIRG'],
      default: 'AIRL'
    },
    type: {
      type: String,
      enum: ['SALE', 'RENT'],
      default: 'SALE',
      index: true
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true
    },
    tokenId: {
      type: String,
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
    },
    expiresAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.MarketplaceListing ||
  mongoose.model<IMarketplaceListing>('MarketplaceListing', marketplaceListingSchema)
