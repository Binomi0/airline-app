import { mongoose } from 'lib/mongoose'

export interface IWallet extends Document {
  email: string
  id: string
  signerAddress: string
  smartAccountAddress: string
}

const walletSchema: mongoose.Schema = new mongoose.Schema<IWallet>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    signerAddress: {
      type: String,
      required: true,
      unique: true
    },
    smartAccountAddress: {
      type: String,
      required: true,
      unique: true
    },
    id: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', walletSchema)
