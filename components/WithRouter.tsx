import { Router } from 'next/router'
import { cloneElement, useCallback, useEffect, useState } from 'react'

const WithRouter = ({ children }: { children: React.JSX.Element }) => {
  const [loading, setLoading] = useState(false)

  const startLoading = useCallback(() => {
    setLoading(true)
  }, [])

  const finishLoading = useCallback(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    Router.events.on('routeChangeStart', startLoading)
    Router.events.on('routeChangeComplete', finishLoading)

    return () => {
      Router.events.off('routeChangeStart', startLoading)
      Router.events.off('routeChangeComplete', finishLoading)
    }
  }, [startLoading, finishLoading])

  return cloneElement(children, { loading })
}

export default WithRouter
