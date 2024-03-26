import { useCallback, useEffect, useRef } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ivaoAuthStore } from 'store/ivaoAuth.atom'
import { pilotsStore } from 'store/pilots.atom'
import { IvaoPilot } from 'types'
import axios from 'config/axios'

interface UsePilotsReturnType {
  getPilots: () => void
}

let current = 0

const usePilots = (): UsePilotsReturnType => {
  const setPilots = useSetRecoilState(pilotsStore)
  const workerRef = useRef<Worker>()
  const [ivaoToken, setIvaoToken] = useRecoilState(ivaoAuthStore)

  const getPilots = useCallback(() => {
    if (!ivaoToken) return
    workerRef.current?.postMessage([ivaoToken])
  }, [ivaoToken])

  useEffect(() => {
    if (!ivaoToken && current === 0) {
      current++
      axios
        .get('/api/ivao/oauth')
        .then((response) => {
          setIvaoToken(response.data)
        })
        .catch((error) => {
          console.log('usePilots error =>', error)
        })
        .finally(() => {
          current = 0
        })
    }
  }, [ivaoToken, setIvaoToken])

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/pilots.worker.ts', import.meta.url))
    workerRef.current.onmessage = (event: MessageEvent<IvaoPilot[]>) => {
      setPilots(event.data)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [setPilots])

  return { getPilots }
}

export default usePilots
