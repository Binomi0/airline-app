import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'
import transporter from 'lib/nodemailer'
import { v4 as uuidv4 } from 'uuid'
import Email from 'next-auth/providers/email'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.email) return res.status(400).end()
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)

      const user = await db.findOne({ email: req.body.email })
      if (!user || !user.emailVerified) {
        const randomNumber = Math.floor((Math.random() * 10000) % 9999)
        await db.insertOne({
          id: uuidv4(),
          email: req.body.email,
          verificationCode: randomNumber,
          verificationDate: Date.now(),
          emailVerified: false
        })

        transporter.sendMail(
          {
            from: process.env.EMAIL_FROM,
            to: req.body.email,
            subject: 'Airline | Verify your email',
            text: `Verification code: ${randomNumber}`,
            html: `<p>Verification code: ${randomNumber}</p>`
          },
          (err, info) => {
            if (err) {
              console.log('ERROR =>', err)
              return
            }
            console.log({ info })
          }
        )
        return res.status(200).send({ success: true })
      }
      return res.status(200).send({ success: true })
    } catch (err) {
      console.log('ERROR =>', err)
      return res.status(500).send(err)
    }
  }
  return res.status(405).end()
}
export default handler
