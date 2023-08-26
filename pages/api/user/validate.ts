import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'
import transporter from 'lib/nodemailer'
import BigNumber from 'bignumber.js'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.code || !req.body.email) {
    res.status(400).end()
    return
  }
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
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: req.body.email,
          subject: 'Airline | Wellcome!',
          text: '¡Bienvenido! Register process already finished, thanks!',
          html: '<p>¡Bienvenido! Register process already finished, thanks!</p>'
        })

        await db.findOneAndUpdate(
          { email: req.body.email },
          { $set: { emailVerified: true, verificationCode: null, verificationDate: null } }
        )
        res.status(200).send({ success: true, id: user.id })
        return
      }
      res.status(403).end()
      return
    } catch (err) {
      console.error('[handler] validate() ERROR =>', err)
      res.status(500).send(err)
      return
    }
  }
  res.status(405).end()
}
export default handler
