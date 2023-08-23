import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'
import transporter from 'lib/nodemailer'
import BigNumber from 'bignumber.js'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.code) return res.status(400).end()
  if (!req.body.email) return res.status(400).end()
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)
      const user = await db.findOne({ email: req.body.email })

      if (!user) {
        throw new Error('User not found')
      }

      const code = new BigNumber(user.verificationCode)
      const vcode = new BigNumber(req.body.code)

      if (code.isEqualTo(vcode)) {
        transporter.sendMail(
          {
            from: process.env.EMAIL_FROM,
            to: req.body.email,
            subject: 'Airline | Wellcome!',
            text: '¡Bienvenido! Register process already finished, thanks!',
            html: '<p>¡Bienvenido! Register process already finished, thanks!</p>'
          },
          (err, info) => {
            if (err) {
              console.log('[sendMail] ERROR =>', err)
              return
            }
            console.log({ info })
          }
        )

        await db.findOneAndUpdate(
          { email: req.body.email },
          { $set: { emailVerified: true, verificationCode: null, verificationDate: null } }
        )
        return res.status(200).send({ success: true, id: user?.id })
      }
      return res.status(403).end()
    } catch (err) {
      console.log('[handler] validate() ERROR =>', err)
      return res.status(500).send(err)
    }
  }
  return res.status(405).end()
}
export default handler
