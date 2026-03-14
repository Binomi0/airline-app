import { useCallback, useEffect, useState } from 'react'
import axios from 'config/axios'

interface UseBackendReadContractProps {
  address: string
  method: string
  params?: any[]
  enabled?: boolean
}

export const useBackendReadContract = <T = any>({
  address,
  method,
  params = [],
  enabled = true
}: UseBackendReadContractProps) => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    if (!address || !method) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post('/api/contracts/read', {
        address,
        method,
        params
      })
      setData(response.data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [address, method, JSON.stringify(params)])

  useEffect(() => {
    if (enabled) {
      refetch()
    }
  }, [enabled, refetch])

  return { data, isLoading, error, refetch }
}
