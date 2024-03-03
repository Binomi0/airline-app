import { Box, Fade, Grid } from '@mui/material'
import { NFT } from '@thirdweb-dev/react'
import CargoItem from './CargoItem'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { FRoute } from 'types'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { getCallsign } from 'utils'
import { FixedSizeList, ListChildComponentProps } from 'react-window'

const renderRow = (
  flightList: [string, FRoute[]][],
  origin: string,
  handleSelect: (origin: string, destination: string) => Promise<void>
) =>
  function renderCustomRow(props: ListChildComponentProps) {
    const { index } = props

    return <CargoItem onSelect={handleSelect} origin={origin} flights={flightList[index][1]} delay={10 * (index + 1)} />
  }

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
      <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}>
        <FixedSizeList height={968} width='100vw' itemSize={46} itemCount={flights.length} overscanCount={5}>
          {renderRow(flights, origin, handleSelect)}
        </FixedSizeList>
      </Box>
      {/* <Grid container spacing={2}>
        {flights.slice(0, 12).map(([key, value], index) => (
          <CargoItem onSelect={handleSelect} key={key} origin={key} flights={value} delay={500 * (index + 1)} />
        ))}
      </Grid> */}
    </Fade>
  )
}

export default CargoList
