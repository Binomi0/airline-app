import { Fade, Grid } from '@mui/material'
import { NFT } from '@thirdweb-dev/react'
import CargoItem from './CargoItem'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { FRoute } from 'types'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { getCallsign } from 'utils'

const CargoList: React.FC<{
  // eslint-disable-next-line no-unused-vars
  newCargo: (route: FRoute, aircraft: NFT, callsign: string, remote: boolean) => void
  setSelected: Dispatch<SetStateAction<FRoute>>
  flights: [string, FRoute[]][]
  aircraft?: NFT
}> = ({ newCargo, setSelected, flights, aircraft }) => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()

  const handleSelect = useCallback(
    async (origin: string, destination: string) => {
      if (!aircraft) {
        throw new Error('Missing aircraft')
      }
      newCargo({ origin, destination }, aircraft, getCallsign(), false)
      setSelected({ origin, destination })
    },
    [newCargo, setSelected, aircraft]
  )

  return (
    <Fade in={flights.length > 0 && !!address} unmountOnExit>
      <Grid container spacing={2}>
        {flights.slice(0, 12).map(([key, value], index) => (
          <CargoItem onSelect={handleSelect} key={key} origin={key} flights={value} delay={500 * (index + 1)} />
        ))}
      </Grid>
    </Fade>
  )
}

export default CargoList
