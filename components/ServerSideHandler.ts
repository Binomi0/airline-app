import { GetServerSidePropsContext } from 'next'
import { deleteCookie, getCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { connectDB } from 'lib/mongoose'
import User, { IUser } from 'models/User'

interface Props {
  props: {
    token?: string | null
    user?: Partial<IUser> | null
  }
}

const serverSidePropsHandler = async (ctx: GetServerSidePropsContext): Promise<Props> => {
  try {
    const token = getCookie('token', { req: ctx.req, res: ctx.res }) as string
    if (token) {
      return {
        props: {
          user: null,
          token
        }
      }
      // try {
      //   const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload

      //   const { email } = decoded.data
      //   if (!email) {
      //     deleteCookie('token', { req: ctx.req, res: ctx.res })
      //     return {
      //       props: {
      //         token: null,
      //         user: null
      //       }
      //     }
      //   }

      //   try {
      //     await connectDB()
      //     const user = await User.findOne({ email }).populate('vaUser', 'pilotId type -_id')

      //     if (user) {
      //       return {
      //         props: {
      //           token,
      //           user: {
      //             id: user.id,
      //             userId: user.userId,
      //             email: user.email,
      //             emailVerified: user.emailVerified,
      //             address: user.address?.toString() || null,
      //             role: user.role,
      //             ...(user.vaUser
      //               ? {
      //                   vaUser: JSON.parse(JSON.stringify(user.vaUser))
      //                 }
      //               : {})
      //           }
      //         }
      //       }
      //     }
      //   } catch (err) {
      //     console.error(new Date(), '[serverSidePropsHandler] error finding user or connecting to DB =>', err)
      //   }
      // } catch (err) {
      //   console.error(new Date(), '[serverSidePropsHandler] error decoding jwt =>', err)
      // }
    }
  } catch (err) {
    console.error(new Date(), '[serverSidePropsHandler] ERROR WHILE GETTING COOKIE TOKEN =>', err)
  }

  return {
    props: {
      user: null,
      token: null
    }
  }
}

export default serverSidePropsHandler
