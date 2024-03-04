import { NextApiRequest, NextApiResponse } from 'next'
import transporter from 'lib/nodemailer'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { connectDB } from 'lib/mongoose'
import User from 'models/User'

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
      await connectDB()

      const user = await User.findOne({ email: req.body.email })

      if (user && user.emailVerified) {
        res.status(200).send({ success: false })
        return
      }

      const randomNumber = Math.floor(Math.random() * 9000 + 1000)

      if (!user) {
        const userId = uuidv4()

        const createUser = User.create({
          id: userId,
          userId,
          email: req.body.email,
          verificationCode: randomNumber,
          verificationDate: moment().add('5', 'minutes').unix(),
          emailVerified: false
        })
        const sendEmail = sendVerifyEmail(req.body.email, randomNumber.toString())

        await Promise.all([createUser, sendEmail])

        res.status(200).send({ success: true })
        return
      } else if (!user.emailVerified) {
        if (moment().isAfter(moment(user.verificationDate))) {
          const sendEmail = sendVerifyEmail(req.body.email, randomNumber.toString())
          const updateUser = User.findOneAndUpdate(
            { email: req.body.email },
            { $set: { verificationCode: randomNumber, verificationDate: moment().add('5', 'minutes').unix() } }
          )

          await Promise.all([sendEmail, updateUser])
        }
        res.status(200).send({ success: true })
        return
      }
      res.status(400).end()
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
