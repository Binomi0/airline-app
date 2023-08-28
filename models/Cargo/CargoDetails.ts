import { mongoose } from 'lib/mongoose'
import { ObjectId } from 'mongodb'
import { CargoDetails } from 'types'

export interface ICargoDetails extends  Document, CargoDetails {
  cargo: ObjectId
}

const cargoSchema: mongoose.Schema = new mongoose.Schema<ICargoDetails>(
  {
    cargo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
)

export default mongoose.models.CargoDetails || mongoose.model<ICargoDetails>('CargoDetails', cargoSchema)
