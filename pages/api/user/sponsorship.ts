import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import MissionModel from 'models/Mission'
import { MissionStatus } from 'types'
import { twServer, activeChain } from 'config'
import { rewardTokenAddress } from 'contracts/address'
import { getContract, readContract } from 'thirdweb'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const userId = req.id
    const userAddress = req.query.address as string

    // 1. Check completed missions
    const completedCount = await MissionModel.countDocuments({
      userId,
      status: MissionStatus.COMPLETED
    })

    let hasFuel = false
    if (userAddress) {
      try {
        const contract = getContract({
          client: twServer,
          chain: activeChain,
          address: rewardTokenAddress
        })

        const balance = await readContract({
          contract,
          method: 'function balanceOf(address owner) view returns (uint256)',
          params: [userAddress]
        })

        hasFuel = (balance as bigint) > 0n
      } catch (e) {
        console.error('Error fetching AIRG balance for sponsorship:', e)
      }
    }

    const sponsorGas = completedCount < 10 || hasFuel

    res.status(200).json({
      sponsorGas,
      completedCount,
      hasFuel
    })
  } catch (error) {
    console.error('Sponsorship API ERROR =>', error)
    res.status(500).end()
  }
}

export default withAuth(handler)
