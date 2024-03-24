import Search from '@mui/icons-material/Search'
import React, { useRef, useState } from 'react'
import styles from '../styles/ivao.module.css'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import { Atc } from 'types'
import { useVaProviderContext } from 'context/VaProvider'
import CellTowerIcon from '@mui/icons-material/CellTower'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'

const ZERO = 0
const TWENTY_FIVE = 25

const filterActiveAtcs = (atc: Atc) => {
  const activated = Date.parse(atc.updatedAt)
  const now = Date.now()

  return now - activated > 1000 * 60 * 10
}
const filterAtcs = (search: string) => (atc: Atc) => atc.callsign.toLowerCase().includes(search.toLowerCase())
const filterAtcTowers = (atc: Atc) => atc.callsign.includes('_TWR')
const sortByCallsign = (a: Atc, b: Atc) => {
  if (a.callsign > b.callsign) return 1
  else if (a.callsign < b.callsign) return -1
  return 0
}

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSelect: (atcId: string, side: 'start' | 'end') => void
  start: string
  end: string
}

const IvaoAtcs = ({ start, end, onSelect }: Props) => {
  const { atcs } = useVaProviderContext()
  const theme = useTheme()
  const atcSearchRef = useRef<HTMLInputElement>()
  const [atcSearch, setAtcSearch] = useState<string>('')

  const filteredAtcs = atcs
    .filter(filterAtcs(atcSearch))
    .filter(filterActiveAtcs)
    .filter(filterAtcTowers)
    .slice(ZERO, TWENTY_FIVE)
    .sort(sortByCallsign)

  return (
    <Box minWidth={300} height='calc(100vh - 64px)' sx={{ overflow: 'auto', overflowX: 'hidden' }}>
      <Box className={styles.textFieldBox}>
        <Box p={1} bgcolor={theme.palette.common.white}>
          <TextField
            disabled={!atcs}
            fullWidth
            label='Search Active ATC'
            size='small'
            color='info'
            variant='outlined'
            inputRef={atcSearchRef}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setAtcSearch(atcSearchRef.current?.value || '')}>
                  <Search color='info' />
                </IconButton>
              )
            }}
          />
        </Box>
        <Stack bgcolor='green'>
          <Typography align='center' fontSize={8}>
            IVAO ACTIVE TOWER CONTROL
          </Typography>
        </Stack>
      </Box>
      {filteredAtcs.map((atc) => (
        <Paper key={atc.id} className={styles.paper}>
          <Stack direction='row' justifyContent='space-between' p={1}>
            <Box>
              <Typography variant='subtitle1'>{atc.callsign.split('_')[0]}</Typography>
              <Stack direction='row' spacing={1} alignItems='center'>
                <CellTowerIcon fontSize='inherit' />
                <Typography variant='caption'>
                  {Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(
                    atc.atcSession.frequency
                  )}
                </Typography>
              </Stack>
            </Box>
            <Stack direction='column' spacing={1}>
              <FlightTakeoffIcon
                color={start === atc.callsign ? 'success' : 'inherit'}
                onClick={() => onSelect(atc.callsign === start ? '' : atc.callsign, 'start')}
                className={styles.icon}
                fontSize='small'
              />
              <FlightLandIcon
                color={end === atc.callsign ? 'info' : 'inherit'}
                onClick={() => onSelect(atc.callsign === end ? '' : atc.callsign, 'end')}
                className={styles.icon}
                fontSize='small'
              />
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Box>
  )
}

export default IvaoAtcs
