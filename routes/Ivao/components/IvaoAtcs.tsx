import { Search } from '@mui/icons-material'
import { Box, TextField, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material'
import React, { useRef, useState } from 'react'
import styles from '../styles/ivao.module.css'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import { Atc } from 'types'
import { useVaProviderContext } from 'context/VaProvider'
import CellTowerIcon from '@mui/icons-material/CellTower'

const filterActiveAtcs = (atc: Atc) => {
  const activated = Date.parse(atc.updatedAt)
  const now = Date.now()
  return now - activated < 1000 * 60 * 10
}

const filterAtcs = (search: string) => (atc: Atc) => atc.callsign.toLowerCase().includes(search.toLowerCase())
const filterAtcTowers = (atc: Atc) => atc.callsign.includes('_TWR')

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

  return (
    <Box minWidth={300} height='calc(100vh - 64px)' sx={{ overflow: 'auto', overflowX: 'hidden' }}>
      <Box p={1} bgcolor={theme.palette.common.white} className={styles.textFieldBox}>
        <TextField
          fullWidth
          focused
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
      {atcs
        .filter(filterAtcs(atcSearch))
        .filter(filterActiveAtcs)
        .filter(filterAtcTowers)
        .slice(0, 25)
        .map((atc) => (
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
