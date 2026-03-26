import { useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import { LICENSES, License } from 'config/licenses'
import { useMemo } from 'react'

export interface PilotProgress {
  totalHours: number
  unlockedLicenses: string[] // IDs of unlocked licenses
  nextLicense: License | null
  progressToNext: number // 0-100
}

const usePilotProgress = (): PilotProgress => {
  const ivaoUser = useRecoilValue(ivaoUserStore)

  const totalHours = useMemo(() => {
    if (!ivaoUser?.hours) return 0
    // Sum only pilot hours (we assume all types for now or filter by 'p' if we knew it)
    // Based on IVAO API, 'p' is pilot, 'a' is atc.
    return ivaoUser.hours.reduce((acc, curr) => {
      if (curr.type.toLowerCase().includes('p')) {
        return acc + curr.hours
      }
      return acc
    }, 0)
  }, [ivaoUser])

  const unlockedLicenses = useMemo(() => {
    return LICENSES.filter((license) => totalHours >= license.minHours).map((l) => l.id)
  }, [totalHours])

  const nextLicense = useMemo(() => {
    return LICENSES.find((license) => totalHours < license.minHours) || null
  }, [totalHours])

  const progressToNext = useMemo(() => {
    if (!nextLicense) return 100
    const currentLicense = [...LICENSES]
      .reverse()
      .find((license) => totalHours >= license.minHours)
    
    const min = currentLicense ? currentLicense.minHours : 0
    const max = nextLicense.minHours
    
    if (max === min) return 100
    
    const progress = ((totalHours - min) / (max - min)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }, [totalHours, nextLicense])

  return {
    totalHours,
    unlockedLicenses,
    nextLicense,
    progressToNext
  }
}

export default usePilotProgress
