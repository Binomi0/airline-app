import { useCallback, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ivaoAuthStore } from 'store/ivaoAuth.atom'
import { pilotStore } from 'store/pilot.atom'
import { IvaoPilot } from 'types'

interface UsePilotsReturnType {
  getPilots: () => void
}

const usePilots = (): UsePilotsReturnType => {
  const workerRef = useRef<Worker>()
  const setPilots = useSetRecoilState(pilotStore)
  const ivaoToken = useRecoilValue(ivaoAuthStore)

  const getPilots = useCallback(() => {
    if (!ivaoToken) return
    workerRef.current?.postMessage([ivaoToken])
  }, [ivaoToken])

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
