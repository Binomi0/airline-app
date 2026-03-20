import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Help = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/guide')
  }, [router])

  return null
}

export default Help
