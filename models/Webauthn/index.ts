import { mongoose } from 'lib/mongoose'

interface Authenticator {
  credentialPublicKey: string
  credentialID: string
  counter: number
}

export interface IWebauthn extends Document {
  email: string
  challenge: string
  id: string
  key: string
  authenticators: Authenticator[]
  createdAt: string
  updatedAt: string
}

const webauthSchema: mongoose.Schema = new mongoose.Schema<IWebauthn>(
  {
    email: {
      type: String,
      required: true,
      index: true
    },
    challenge: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true,
      index: true
    },
    key: {
      type: String
    },
    authenticators: [
      {
        credentialPublicKey: {
          type: String
        },
        credentialID: {
          type: String
        },
        counter: {
          type: Number
        }
      }
    ],
    createdAt: Date,
    updatedAt: Date
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Webauthn || mongoose.model<IWebauthn>('Webauthn', webauthSchema)
