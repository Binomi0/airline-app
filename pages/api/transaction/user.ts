import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import TransactionModel from 'models/Transaction'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.operation) return res.status(400).end()
    if (!req.body.amount) return res.status(400).end()
    if (!req.body.hash) return res.status(400).end()

    try {
      await connectDB()

      const collection = await TransactionModel.create({
        email: req.user,
        operation: req.body.operation,
        amount: req.body.amount,
        transactionDate: Date.now(),
        hash: req.body.hash,
        isCompleted: false,
        role: 'user'
      })

      console.log({ collection })

      // await collection.insertOne({
      //   email: req.user,
      //   operation: req.body.operation,
      //   amount: req.body.amount,
      //   transactionDate: Date.now(),
      //   hash: req.body.hash,
      //   isCompleted: false,
      // })

      return res.status(202).end()
    } catch (err) {
      return res.status(500).send(err)
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
