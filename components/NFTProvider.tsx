import { ReactNode, useEffect, useMemo, useState } from 'react'
import axios from 'config/axios'
import { AircraftProvider } from 'context/AircraftProvider'
import { LicenseProvider } from 'context/LicenseProvider'
import { Nft } from 'alchemy-sdk'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { userState } from 'store/user.atom'
import alchemy from 'lib/alchemy'
import { nftAircraftTokenAddress, nftLicenseTokenAddress } from 'contracts/address'
import { aircraftStore } from 'store/aircraft.atom'
import { nftLicenseStore } from 'store/nft.licenses.atom'

interface Props {
  // eslint-disable-next-line no-unused-vars
  children: ReactNode
}

const NFTProvider = ({ children }: Props) => {
  const setAircraftNftStore = useSetRecoilState(aircraftStore)
  // const setLicenseNftStore = useSetRecoilState(nftLicenseStore)

  useEffect(() => {
    const promises = [
      alchemy.nft.getNftsForContract(nftAircraftTokenAddress),
      alchemy.nft.getNftsForContract(nftLicenseTokenAddress)
    ]

    Promise.all(promises).then(([aircrafts, licenses]) => {
      setAircraftNftStore(aircrafts.nfts)
      // setLicenseNftStore(licenses.nfts)
    })
  }, [setAircraftNftStore])

  // console.log({ aircraftNfts, licenseNfts })
  // return null
  return (
    <AircraftProvider>
      <LicenseProvider>{children}</LicenseProvider>
    </AircraftProvider>
  )
}

export default NFTProvider
