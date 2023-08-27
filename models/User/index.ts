import { mongoose } from 'lib/mongoose'

enum Role {
  user = 'user',
  admin = 'admin'
}

export interface IUser extends Document {
  email: string
  address?: string
  lastLogin?: number
  role: Role
  id: string
  verificationCode?: number
  verificationDate?: number
  emailVerified: boolean
}

const userSchema: mongoose.Schema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      index: true
    },
    address: {
      type: String
    },
    lastLogin: {
      type: Number
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.user
    },
    verificationCode: {
      type: Number
    },
    verificationDate: {
      type: Number
    },
    emailVerified: {
      type: Boolean
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)
