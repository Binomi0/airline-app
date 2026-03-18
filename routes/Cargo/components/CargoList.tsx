import CargoItem from './CargoItem'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { FRoute } from 'types'
import { getCallsign } from 'utils'
import Fade from '@mui/material/Fade'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { INft } from 'models/Nft'
import Grid from '@mui/material/Grid'

// interface RowProps {
//   flightList: [string, FRoute[]][]
//   handleSelect: (origin: string, destination: string) => Promise<void>
// }

// const Row = ({ index, style, flightList, handleSelect }: RowComponentProps<RowProps>) => {
//   return (
//     <CargoItem
//       onSelect={handleSelect}
//       origin={flightList[index][0]}
//       flights={flightList[index][1]}
//       delay={10 * (index + 1)}
//       style={style}
//     />
//   )
// }

type Props = {
  newCargo: (route: FRoute, aircraft: INft, callsign: string, remote: boolean) => void
  setSelected: Dispatch<SetStateAction<FRoute>>
  flights: [string, FRoute[]][]
  aircraft?: INft
}

const CargoList = ({ newCargo, setSelected, flights, aircraft }: Props) => {
  const address = useRecoilValue(smartAccountAddressStore)

  const handleSelect = useCallback(
    async (origin: string, destination: string) => {
      if (!aircraft) {
        throw new Error('Missing aircraft')
      }
      newCargo({ origin, destination, distance: 0 }, aircraft, getCallsign(), false)
      setSelected({ origin, destination, distance: 0 })
    },
    [newCargo, setSelected, aircraft]
  )

  return (
    <Fade in={flights.length > 0 && !!address} unmountOnExit>
      {/* <Box sx={{ width: '100%', height: '70vh', bgcolor: 'background.paper' }}>
        <List
          rowHeight={180}
          rowCount={flights.length}
          rowComponent={Row}
          rowProps={{ flightList: flights, handleSelect }}
          overscanCount={5}
          style={{ height: 600, width: '100%' }}
        />
      </Box> */}
      <Grid container spacing={2}>
        {flights.slice(0, 12).map(([key, value], index) => (
          <CargoItem onSelect={handleSelect} key={key} origin={key} flights={value} delay={500 * (index + 1)} />
        ))}
      </Grid>
    </Fade>
  )
}

export default CargoList
