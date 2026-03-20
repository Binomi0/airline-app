import type { IvaoPilot } from 'types'

interface UseFlight {
  pilot?: IvaoPilot
}

const useFlight = (): UseFlight => {
  return {
    pilot: undefined
  }
}

export default useFlight
