import { useAuthProviderContext } from 'context/AuthProvider'

const useAuth = () => {
  const { user, token } = useAuthProviderContext()

  return { user, token }
}

export default useAuth
