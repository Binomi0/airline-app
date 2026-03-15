import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { ownedLicenseNftStore } from 'store/licenseNFT.atom'
import { useSWRConfig } from 'swr'
import { fetcher } from 'utils'

const useLicense = () => {
  const data = useRecoilValue(ownedLicenseNftStore)
  const { mutate } = useSWRConfig()

  const hasLicense = !!data && data.length > 0

  const isLicenseOwned = useCallback(
    (id: string | bigint) => {
      return !!data && data.some((n) => BigInt(n.id) === BigInt(id))
    },
    [data]
  )

  const refetch = async () => {
    await fetcher('/api/nft/owned?refresh=true')
    mutate('/api/nft')
    mutate('/api/nft/owned')
  }

  return { data, hasLicense, isLicenseOwned, refetch }
}

export default useLicense
