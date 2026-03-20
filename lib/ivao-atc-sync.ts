import { AtcModel, AtcHistoryModel } from 'models'
import { Atc, AtcStatus } from 'types'
import { withLock } from './locks'

/**
 * Synchronizes incoming ATC data with the database, handling grace periods
 * for disconnections and archiving completed sessions.
 */
export async function syncAtcsWithGracePeriod(incomingAtcs: Atc[]) {
  return await withLock('atc_sync', 30, async () => {
    const now = new Date()
    const incomingCallsigns = incomingAtcs.map((a) => a.callsign)

  // 1. Mark missing ATCs as DISCONNECTED
  await AtcModel.updateMany(
    { callsign: { $nin: incomingCallsigns }, status: AtcStatus.ACTIVE },
    { $set: { status: AtcStatus.DISCONNECTED } }
  )

  // 2. Archive and remove expired DISCONNECTED ATCs (Grace period: 10 mins)
  const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000)
  const expiredAtcs = await AtcModel.find({
    status: AtcStatus.DISCONNECTED,
    lastSeenAt: { $lt: tenMinsAgo }
  }).lean()

  if (expiredAtcs.length > 0) {
    console.info('[ATC Sync] Archiving %d expired ATC sessions', expiredAtcs.length)
    const historyRecords = expiredAtcs.map((atc) => ({
      callsign: atc.callsign,
      airportIcao: atc.atcPosition?.airport?.icao || 'UNKNOWN',
      firstSeenAt: atc.firstSeenAt || atc.createdAt || now,
      lastSeenAt: atc.lastSeenAt || now,
      durationMinutes: Math.round(
        (new Date(atc.lastSeenAt || now).getTime() - new Date(atc.firstSeenAt || atc.createdAt || now).getTime()) / 60000
      )
    }))

    try {
      await AtcHistoryModel.insertMany(historyRecords, { ordered: false })
      await AtcModel.deleteMany({ _id: { $in: expiredAtcs.map((a) => a._id) } })
    } catch (err) {
      console.error('[ATC Sync] Error archiving ATC history:', err)
    }
  }

  // 3. Process Incoming ATCs (Update or Insert)
  const currentAtcs = await AtcModel.find({ callsign: { $in: incomingCallsigns } }).lean()
  const currentMap = new Map(currentAtcs.map((a) => [a.callsign, a]))

  const bulkOps = incomingAtcs.map((atc) => {
    const existing = currentMap.get(atc.callsign)
    if (existing) {
      return {
        updateOne: {
          filter: { callsign: atc.callsign },
          update: {
            $set: {
              ...atc,
              lastSeenAt: now,
              status: AtcStatus.ACTIVE,
              firstSeenAt: existing.firstSeenAt || existing.createdAt || now
            }
          }
        }
      }
    } else {
      return {
        insertOne: {
          document: {
            ...atc,
            firstSeenAt: now,
            lastSeenAt: now,
            status: AtcStatus.ACTIVE
          }
        }
      }
    }
  })

  if (bulkOps.length > 0) {
    console.log('[ATC Sync] Processing %d ATC updates/inserts', bulkOps.length)
    await AtcModel.bulkWrite(bulkOps)
  }
  })
}
