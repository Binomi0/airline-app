import { connectDB } from 'lib/mongoose'
import PublicMission from 'models/PublicMission'

async function clearPool() {
  await connectDB()
  const result = await PublicMission.deleteMany({ status: 'AVAILABLE' })
  console.log(`Cleared ${result.deletedCount} available missions.`)
  process.exit(0)
}

clearPool()
