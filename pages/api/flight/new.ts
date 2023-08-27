import { NextApiHandler } from 'next'
import fs from 'fs'
import withAuth from 'lib/withAuth'

interface Flight {
  cargoId: number
}

const FLIGHTS_PATH = './pages/api/flight/data/flights.json'

const handler: NextApiHandler = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  try {
    const file = fs.readFileSync(FLIGHTS_PATH, {
      encoding: 'utf-8'
    })

    const parsedFile: Flight[] = JSON.parse(file)
    const cargo = parsedFile.find((p) => p.cargoId === req.body.cargoId)
    if (cargo) {
      res.status(409).end()
      return
    }

    fs.writeFileSync(FLIGHTS_PATH, JSON.stringify([...parsedFile, req.body]), {
      encoding: 'utf-8'
    })

    res.status(400).end()
  } catch (error) {
    fs.writeFileSync(FLIGHTS_PATH, JSON.stringify([req.body]), {
      encoding: 'utf-8'
    })
    res.status(201).end()
  }
}

export default withAuth(handler)
