import { useRecoilValue } from 'recoil'
import { ownedLicenseNftStore } from 'store/licenseNFT.atom'

const useLicense = () => {
  const data = useRecoilValue(ownedLicenseNftStore)

  const hasLicense = !!data && data.length > 0

  return { hasLicense, refetch: () => {} }
}

export default useLicense
