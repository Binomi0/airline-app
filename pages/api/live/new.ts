import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { LiveModel as Live } from 'models'
import { NextApiResponse } from 'next'
import { LastTrackStateEnum } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  } else if (!req.body.cargo) {
    res.status(400).end()
    return
  }

  const { cargo } = req.body

  try {
    const live = await Live.findOne({ userId: req.id })
    if (!live) {
      const current = await Live.create({
        cargoId: cargo._id,
        userId: req.id,
        aircraftId: cargo.aircraftId,
        callsign: cargo.callsign,
        isCompleted: false,
        track: { name: LastTrackStateEnum.Boarding, value: new Date() }
      })
      res.status(201).send(current)
      return
    }

    res.status(202).send(live)
  } catch (error) {
    console.error('New Live ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
