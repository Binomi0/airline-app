import { mongoose } from 'lib/mongoose'

export enum VirtualAirlineType {
  // eslint-disable-next-line no-unused-vars
  IVAO = 'IVAO',
  // eslint-disable-next-line no-unused-vars
  VATSIM = 'VATSIM'
}
export interface IVirtualAirline extends Document {
  pilotId: string
  type: VirtualAirlineType
}

const virtualAirlineSchema: mongoose.Schema = new mongoose.Schema<IVirtualAirline>(
  {
    pilotId: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true,
      enum: VirtualAirlineType
    }
  },
  {
    timestamps: false
  }
)

export default mongoose.models.VirtualAirline || mongoose.model<IVirtualAirline>('VirtualAirline', virtualAirlineSchema)
