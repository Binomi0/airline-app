import { mongoose } from 'lib/mongoose'

export interface IAircraft extends Document {
  metadata?: {
    name?: string
    description?: string
    image?: string
    attributes?: [
      {
        trait_type?: string
        value?: string
      }
    ]
    id?: string
    uri?: string
  }
  owner?: string
  type?: string
  supply?: string
}

const aircraftSchema: mongoose.Schema = new mongoose.Schema<IAircraft>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    metadata: {
      id: { type: String },
      uri: { type: String },
      name: { type: String },
      description: { type: String },
      image: { type: String },
      attributes: [
        {
          trait_type: { type: String },
          value: { type: String }
        }
      ]
    },
    type: {
      type: String
    },
    supply: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Aircraft || mongoose.model<IAircraft>('Aircraft', aircraftSchema)
