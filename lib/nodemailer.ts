import { createTransport } from 'nodemailer'

const transporter = createTransport({
  // @ts-ignore
  host: process.env.EMAIL_SERVER_HOST as string,
  port: process.env.EMAIL_SERVER_PORT,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})
transporter.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log('Server is ready to take our messages')
  }
})

export default transporter
