import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'
import transporter from 'lib/nodemailer'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

const sendVerifyEmail = async (email: string, code: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Airline | Verify your email',
      text: `Verification code: ${code}`,
      html: `<p>Verification code: ${code}</p>`
    })
  } catch (err) {
    throw new Error('Error while sending code email')
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.email) {
    res.status(400).end()
    return
  }
  if (req.method === 'POST') {
    try {
      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)

      const user = await db.findOne({ email: req.body.email })
      if (user && user.emailVerified) res.status(202).end()
      const randomNumber = Math.floor(Math.random() * 9000 + 1000)

      const userId = uuidv4()
      if (!user) {
        await db.insertOne({
          id: userId,
          email: req.body.email,
          verificationCode: randomNumber,
          verificationDate: moment().add('5', 'minutes').unix(),
          emailVerified: false
        })

        await sendVerifyEmail(req.body.email, randomNumber.toString())
        res.status(200).send({ success: true, id: userId })
        return
      } else if (!user.emailVerified) {
        if (moment().isAfter(moment(user.verificationDate))) {
          await sendVerifyEmail(req.body.email, randomNumber.toString())
          await db.findOneAndUpdate(
            { email: req.body.email },
            { $set: { verificationCode: randomNumber, verificationDate: moment().add('5', 'minutes').unix() } }
          )
        }
        res.status(200).send({ success: true, id: userId })
        return
      }
      res.status(200).send({ success: false })
      return
    } catch (err) {
      console.error('[handler] create() ERROR =>', err)
      res.status(500).send(err)
      return
    }
  }
  res.status(405).end()
}
export default handler
