import usePilotProgress from 'hooks/usePilotProgress'

type UseLicenseReturnType = {
  hasLicense: boolean
}

const useLicense = (licenseId: string): UseLicenseReturnType => {
  const { unlockedLicenses } = usePilotProgress()

  const hasLicense = unlockedLicenses.includes(licenseId)

  return { hasLicense }
}

export default useLicense
