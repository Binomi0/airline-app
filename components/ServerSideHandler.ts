import { GetServerSidePropsContext } from 'next'
import { deleteCookie, getCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { connectDB, mongoose } from 'lib/mongoose'
import User, { IUser } from 'models/User'

interface Props {
  props: {
    token?: string | null
    user?: Partial<IUser> | null
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
          props: {
            token: null,
            user: null
          }
        }
      }

      await connectDB()
      const user = await User.findOne({ email })

      if (user) {
        return {
          props: {
            token,
            user: {
              id: user.id,
              userId: user.userId,
              email: user.email,
              emailVerified: user.emailVerified,
              address: user.address.toString(),
              role: user.role
            }
          }
        }
      }
    } catch (err) {
      deleteCookie('token', { req: ctx.req, res: ctx.res })
      return {
        props: {
          token: null,
          user: null
        }
      }
    }
  }

  return {
    props: {
      user: null,
      token: null
    }
  }
}

export default serverSidePropsHandler
