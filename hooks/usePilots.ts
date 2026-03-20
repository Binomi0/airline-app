import { useCallback, useEffect, useRef } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { authStore } from 'store/auth.atom'
import { pilotStore } from 'store/pilot.atom'
import { IvaoPilot } from 'types'

interface UsePilotsReturnType {
  getPilots: () => void
}

const usePilots = (): UsePilotsReturnType => {
  const workerRef = useRef<Worker>()
  const token = useRecoilValue(authStore)
  const setPilots = useSetRecoilState(pilotStore)

  const getPilots = useCallback(() => {
    workerRef.current?.postMessage([token])
  }, [token])

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
