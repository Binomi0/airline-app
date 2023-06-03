import { ThirdwebAuth } from '@thirdweb-dev/auth/next'
import { PrivateKeyWallet } from '@thirdweb-dev/auth/evm'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || '',
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ''),
  callbacks: {
    onLogin: async (address) => {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)

      try {
        const user = await db.findOne({ address }, { projection: { _id: 1, role: 1 } })
        if (!user) {
          await db.insertOne({
            address: address.toString(),
            createdAt: Date.now(),
            lastLogin: Date.now(),
            role: 'user'
          })
          return { user: { role: ['user'] } }
        } else {
          await db.updateOne({ address: address.toString() }, { $set: { lastLogin: Date.now() } })
        }

        return { user: { role: [user.role] } }
      } catch (error) {
        console.log('error =>', error)
        return null
      }
    },
    onUser: async (user) => {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)

      try {
        const dbUser = await db.findOne({ address: user.address.toString() }, { projection: { _id: 1, role: 1 } })

        if (!dbUser) {
          await db.insertOne({ address: user.address.toString(), createdAt: Date.now(), lastLogin: Date.now() })
          return { user: { role: ['user'] } }
        } else {
          await db.updateOne({ address: user.address.toString() }, { $set: { lastAccess: Date.now() } })
        }

        return { user: { role: [dbUser.role] } }
      } catch (error) {
        console.log('error =>', error)
        return null
      }
    },
    onLogout: async (user) => {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)

      await db.findOneAndUpdate({ address: user.address }, { $inc: { numLogOuts: 1 } })

      return null
    }
  }
})

export default ThirdwebAuthHandler()
