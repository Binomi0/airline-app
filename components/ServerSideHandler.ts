import { GetServerSidePropsContext } from 'next'
import { getCookie } from 'cookies-next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import clientPromise from 'lib/mongodb'
import { Collection, DB } from 'types'

interface User {
  email: string
  address: string
}

const serverSidePropsHandler = async (ctx: GetServerSidePropsContext): Promise<{ props: { user?: User } }> => {
  const token = getCookie('token', { req: ctx.req, res: ctx.res })
  if (token) {
    try {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET) as JwtPayload
      const { email } = decoded.data
      if (!email) {
        return {
          props: {}
        }
      }

      const client = await clientPromise
      const db = client.db(DB.develop).collection(Collection.user)
      const user = await db.findOne<User>({ email }, { projection: { _id: 0 } })

      if (user) {
        console.log({ user })
        return {
          props: {
            user: {
              email,
              address: ''
            }
          }
        }
      }
    } catch (err) {
      console.log('TOKEN ERROR =>', err)
      return { props: {} }
    }
  }
  try {
    return {
      props: {}
    }
    //   const refreshToken: string = getCookie("refreshToken", ctx) as string;

    //   if (!refreshToken) {
    //     throw new Error("Missing token");
    //   }
    //   const detectedIp = requestIp.getClientIp(ctx.req);
    //   internalApi.defaults.headers.common["x-forwarded-for"] = detectedIp || "0";

    //   const response = await internalApi.post<ILoginAuth>(
    //     ApiRoutes.AUTH_LOGIN_REFRESH,
    //     { refreshToken }
    //   );

    //   internalApi.defaults.headers.common.Authorization = `Bearer ${response.data.idToken}`;
    //   return {
    //     props: {},
    //   };
  } catch (err) {
    console.log('Error in server =>', err)
    //   if (ctx.res.writeHead) {
    //     ctx.res.writeHead(302, { Location: AppRoutes.ACCESS });
    //     ctx.res.end();
    //   }

    return {
      props: {} as never
    }
  }
}

export default serverSidePropsHandler
