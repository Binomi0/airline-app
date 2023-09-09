import { Box, Button, Grid, LinearProgress, Typography } from '@mui/material'
import {  useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import FlightDetails from 'components/FlightDetails'
import { useVaProviderContext } from 'context/VaProvider'
import { nftAircraftTokenAddress } from 'contracts/address'
import useAuth from 'hooks/useAuth'
import React from 'react'
import { IvaoPilot } from 'types'
// import { filterLEOrigins } from 'utils'

const STEP = 5

const IvaoView = () => {
  const { pilots } = useVaProviderContext()
  const [current, setCurrent] = React.useState<IvaoPilot[]>([])
  const [page, setPage] = React.useState(0)
  const { user } = useAuth()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data = [] } = useOwnedNFTs(contract, user?.address)

  const handleSelect = React.useCallback(
    (callsign: string) => {
      const i = pilots.findIndex((c) => c.callsign === callsign)
      const newCurrent = [pilots[i], ...pilots.filter((c) => c.callsign !== callsign)]
      setCurrent(newCurrent)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [pilots]
  )
  const renderPilots = React.useMemo(
    () =>
      current
        // .filter(filterLEOrigins)
        .filter((pilot) => pilot?.lastTrack?.state === 'Boarding')
        .slice(0, page + STEP)
        .map((pilot, index) => (
          <FlightDetails aircraft={data[0]} session={pilot} key={pilot.id} index={index} onSelect={() => handleSelect(pilot.callsign)} />
        )),
    [current, data, handleSelect, page]
  )

  React.useEffect(() => {
    setCurrent(pilots || [])
  }, [pilots])

  if (!pilots.length || !data) {
    return <LinearProgress />
  }

  return (
    <>
      <Grid container spacing={2}>
        {renderPilots}
      </Grid>
      <Box textAlign='center' my={10}>
        <Button variant='contained' onClick={() => setPage((s) => s + STEP)}>
          Load More...
        </Button>
      </Box>
    </>
  )
}

export default IvaoView
