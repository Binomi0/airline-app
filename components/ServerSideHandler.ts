import { GetServerSidePropsContext } from 'next'
import { deleteCookie, getCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import clientPromise, {db} from 'lib/mongodb'
import { Collection, DB, User } from 'types'

interface Props {
  props: {
    token?: string
    user?: {
      email?: string
      address?: string
    } | null
  }
}

const serverSidePropsHandler = async (ctx: GetServerSidePropsContext): Promise<Props> => {
  const token = getCookie('token', { req: ctx.req, res: ctx.res }) as string
  if (token) {
    try {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload
      const { email } = decoded.data
      if (!email) {
        deleteCookie('token')
        return {
          props: {} as never
        }
      }

      const client = await clientPromise
      const collection = client.db(db).collection(Collection.user)
      const user = await collection.findOne<User>({ email }, { projection: { _id: 0 } })

      if (user) {
        return { props: { token, user } }
      }
    } catch (err) {
      deleteCookie('token')
      return {
        props: {} as never
      }
    }
  }
  try {
    return {
      props: {}
    }
  } catch (err) {
    console.error('Error in server =>', err)
    return {
      props: {} as never
    }
  }
}

export default serverSidePropsHandler
