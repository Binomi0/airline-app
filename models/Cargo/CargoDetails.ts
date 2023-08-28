import { mongoose } from 'lib/mongoose'
import { CargoDetail } from 'types'

export type CargoDetailSchema = Document & CargoDetail

const cargoSchema: mongoose.Schema = new mongoose.Schema<CargoDetailSchema>(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.CargoDetails || mongoose.model<CargoDetailSchema>('CargoDetails', cargoSchema)
