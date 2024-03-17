import { GetServerSidePropsContext } from 'next'
import { getCookie } from 'cookies-next'
import { IUser } from 'models/User'

interface Props {
  props: {
    token?: string | null
    user?: Partial<IUser> | null
  }
}

const serverSidePropsHandler = ({ req, res }: GetServerSidePropsContext): Props => ({
  props: { user: null, token: getCookie('token', { req, res }) as string }
})

export default serverSidePropsHandler
