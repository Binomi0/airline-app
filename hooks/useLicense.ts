import { Hex } from '@alchemy/aa-core'
import { useContract, useNFTBalance } from '@thirdweb-dev/react'
import { nftLicenseTokenAddress } from 'contracts/address'
import { useRef } from 'react'

const useLicense = (address?: Hex) => {
  const { contract: licenseContract } = useContract(nftLicenseTokenAddress)
  const licenses = useRef<Map<string, boolean>>(new Map())

  const licenseD = useNFTBalance(licenseContract, address, 0)
  const licenseC = useNFTBalance(licenseContract, address, 1)
  const licenseB = useNFTBalance(licenseContract, address, 2)
  const licenseA = useNFTBalance(licenseContract, address, 3)

  licenses.current.set('0', !licenseD.data?.isZero())
  licenses.current.set('1', !licenseC.data?.isZero())
  licenses.current.set('2', !licenseB.data?.isZero())
  licenses.current.set('3', !licenseA.data?.isZero())

  return licenses
}

export default useLicense
