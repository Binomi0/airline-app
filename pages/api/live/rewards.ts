import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import { coinTokenAddress } from 'contracts/address'
import User from 'models/User'
import VirtualAirline from 'models/VirtualAirline'
import Mission from 'models/Mission'
import { MissionStatus, MissionStep, LastTrackStateEnum, AtcStatus } from 'types'
import Live from 'models/Live'
import AtcModel from 'models/Atc'
import { getContract, sendAndConfirmTransaction } from 'thirdweb'
import { privateKeyToAccount } from 'thirdweb/wallets'
import { transfer } from 'thirdweb/extensions/erc20'
import { twServer, activeChain as chain } from 'config'

const validateFullFlight = (steps: MissionStep[]): number => {
  let counter = 0
  let result = 0

  steps.forEach((step) => {
    if (step.name === LastTrackStateEnum.Boarding) {
      counter++
    } else if (step.name === LastTrackStateEnum.Departing) {
      counter++
    } else if (step.name === 'Initial Climb') {
      counter++
    } else if (step.name === 'En Route') {
      counter++
    } else if (step.name === LastTrackStateEnum.Approach) {
      counter++
    } else if (step.name === LastTrackStateEnum.Landed) {
      counter++
    } else if (step.name === 'On Blocks') {
      counter++
    }

    if (counter === 7) {
      result = 30
    } else if (counter > 6) {
      result = 15
    }
  })

  return result
}

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  } else if (req.headers['x-api-key'] !== process.env.PRIVATE_API_KEY) {
    res.status(403).end()
    return
  }

  try {
    const mission = await Mission.findOne({ userId: req.id, status: MissionStatus.STARTED })
    if (!mission) throw new Error(`Missing mission for userId: ${req.id}`)
    else if (mission.isRewarded) {
      res.status(200).end()
      return
    }

    const user = await User.findById(req.id)
    if (!user) throw new Error(`Missing user for userId: ${req.id}`)

    const live = await Live.findOne({ userId: req.id })
    if (!live) throw new Error(`Missing live for userId: ${req.id}`)

    const score = validateFullFlight(live.track)
    if (score) {
      if (mission.status !== MissionStatus.ABORTED && !mission.isRewarded) {
        const remote = mission.remote ? 3 : 1
        
        // 1. Calculate Actual vs Estimated time for AFK check
        const flightTimeMinutes = (new Date().getTime() - new Date(mission.createdAt).getTime()) / (1000 * 60)
        const estimatedTime = mission.estimatedTimeMinutes || (mission.distance * 0.25 + 30) // Fallback
        
        let afkMultiplier = 1.0
        if (flightTimeMinutes > estimatedTime * 4) {
          afkMultiplier = 0.1 // Severe penalty for extreme AFK
        } else if (flightTimeMinutes > estimatedTime * 2) {
          afkMultiplier = 0.5 // Moderate penalty
        }

        // 2. Dynamic ATC Bonus (at completion)
        const currentDestAtc = await AtcModel.findOne({ 
          'atcPosition.airport.icao': mission.destination,
          status: { $in: [AtcStatus.ACTIVE, AtcStatus.DISCONNECTED] } 
        })
        
        let atcBonus = 1.0
        if (mission.isSponsored) {
          // If the mission was sponsored, we check if they actually got service at departure/arrival
          const depBonus = mission.originAtcOnStart ? 0.15 : 0
          const arrBonus = !!currentDestAtc ? 0.25 : (mission.destinationAtcOnStart ? 0.1 : 0)
          atcBonus = 1.0 + depBonus + arrBonus
        }

        const finalPrize = ((mission.prize * atcBonus * afkMultiplier) / remote) * (1 + score / 100)

        // Refactored transfer logic for Thirdweb v5
        if (process.env.THIRDWEB_AUTH_PRIVATE_KEY) {
          const serverAccount = privateKeyToAccount({
            client: twServer,
            privateKey: process.env.THIRDWEB_AUTH_PRIVATE_KEY
          })

          const transaction = transfer({
            contract: getContract({
              client: twServer,
              chain,
              address: coinTokenAddress
            }),
            to: user.address,
            amount: Math.round(finalPrize).toString()
          })

          const receipt = await sendAndConfirmTransaction({
            transaction,
            account: serverAccount
          })

          console.log('Reward transfer successful:', receipt.transactionHash, 'Final Prize:', Math.round(finalPrize), 'AFK Multiplier:', afkMultiplier)
        } else {
          console.error('Missing THIRDWEB_AUTH_PRIVATE_KEY for rewards')
          throw new Error('Server wallet not configured')
        }

        await Promise.all([
          Mission.findByIdAndUpdate(mission._id, {
            isRewarded: true,
            status: MissionStatus.COMPLETED,
            score,
            rewards: Math.round(finalPrize)
          }),
          VirtualAirline.findOneAndUpdate({ userId: req.id }, { lastLandedAt: mission.destination }, { upsert: true }),
          Live.findOneAndDelete({ userId: req.id })
        ])

        res.status(201).end()
        return
      }
    } else {
      res.status(203).end()
      return
    }

    res.status(202).end()
  } catch (error) {
    console.error('ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
