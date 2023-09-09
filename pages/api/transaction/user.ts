import { connectDB } from 'lib/mongoose'
import withAuth, { CustomNextApiRequest } from 'lib/withAuth'
import { NextApiResponse } from 'next'
import TransactionModel from 'models/Transaction'

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.body.operation || !req.body.amount || !req.body.hash) {
      res.status(400).end()
      return
    }

    try {
      await connectDB()

      const collection = await TransactionModel.create({
        email: req.user,
        operation: req.body.operation,
        amount: req.body.amount.toString(),
        transactionDate: Date.now(),
        hash: req.body.hash,
        isCompleted: false,
        role: 'user'
      })

      console.log('NEW TRANSACTION ITEM =>', collection)

      // await collection.insertOne({
      //   email: req.user,
      //   operation: req.body.operation,
      //   amount: req.body.amount,
      //   transactionDate: Date.now(),
      //   hash: req.body.hash,
      //   isCompleted: false,
      // })

      res.status(202).end()
    } catch (err) {
      res.status(500).send(err)
    }
  }

  res.status(405).end()
}

export default withAuth(handler)
