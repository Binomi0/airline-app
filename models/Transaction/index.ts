import { mongoose } from 'lib/mongoose'

export interface ITransaction extends Document {
  email: string
  operation: string
  amount: number
  transactionDate: Date
  hash: string
  isCompleted: boolean
  role: string
}

const transactionSchema: mongoose.Schema = new mongoose.Schema<ITransaction>({
  email: {
    type: String,
    required: true,
    index: true
  },
  operation: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  hash: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
})

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema)
