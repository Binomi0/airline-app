import { useAuthProviderContext } from 'context/AuthProvider'

const useAuth = () => {
  const { user } = useAuthProviderContext()

  return { user }
}

export default useAuth
