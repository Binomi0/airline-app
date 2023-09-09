import { mongoose } from 'lib/mongoose'

export interface ITransaction extends Document {
  email: string
  operation: string
  amount: string
  transactionDate: Date
  hash: string
  isCompleted: boolean
  role: string
}

const transactionSchema: mongoose.Schema = new mongoose.Schema<ITransaction>(
  {
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
      type: String,
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
  },
  { timestamps: true }
)

transactionSchema.statics

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema)
