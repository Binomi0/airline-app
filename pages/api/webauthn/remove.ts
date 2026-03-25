import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import Webauthn from 'models/Webauthn'
import { NextApiResponse } from 'next'
import { Authenticator } from 'types'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { credentialID } = req.body

    if (!credentialID) {
      return res.status(400).json({ error: 'Missing credentialID' })
    }

    try {
      await connectDB()
      const webauthn = await Webauthn.findOne({ email: req.user })

      if (!webauthn) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Filter out the authenticator
      const updatedAuthenticators = webauthn.authenticators.filter(
        (auth: Authenticator) => auth.credentialID !== credentialID
      )

      if (updatedAuthenticators.length === webauthn.authenticators.length) {
        return res.status(404).json({ error: 'Authenticator not found' })
      }

      // Update the document
      await Webauthn.findOneAndUpdate(
        { email: req.user },
        {
          $set: {
            authenticators: updatedAuthenticators,
            // If the removed one was the primary key, we might wanna update it
            // but for now let's just keep it simple as the user might add another
            ...(webauthn.key === credentialID ? { key: updatedAuthenticators[0]?.credentialID || '' } : {})
          }
        }
      )

      res.status(200).json({ success: true })
      return
    } catch (err) {
      console.error('Delete Authenticator Error:', err)
      res.status(500).json({ error: 'Internal server error' })
      return
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
