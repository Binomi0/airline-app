import { mongoose } from 'lib/mongoose'
import { AtcHistory } from 'types'

export type AtcHistorySchema = Document & AtcHistory

const atcHistorySchema: mongoose.Schema = new mongoose.Schema<AtcHistorySchema>(
  {
    callsign: { type: String, index: true },
    airportIcao: { type: String, index: true },
    firstSeenAt: { type: Date, required: true },
    lastSeenAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.AtcHistory || mongoose.model<AtcHistorySchema>('AtcHistory', atcHistorySchema)
