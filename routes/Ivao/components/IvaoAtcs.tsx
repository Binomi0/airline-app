import Search from '@mui/icons-material/Search'
import React, { useRef, useState } from 'react'
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
import { LinearProgress, styled } from '@mui/material'
import styles from '../styles/ivao.module.css'

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
  const { atcs, isLoading } = useVaProviderContext()
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
    <Box
      minWidth={300}
      height='calc(100vh - 64px)'
      borderRight='1px solid var(--mui-palette-grey-600 )'
      sx={{ overflow: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}
    >
      <Paper className={styles.textFieldBox}>
        <Box p={1}>
          <TextField
            autoFocus={Boolean(atcs.length)}
            disabled={!atcs.length}
            fullWidth
            label='Search Active ATC'
            size='small'
            // color='info'
            variant='outlined'
            inputRef={atcSearchRef}
            InputProps={{
              endAdornment: (
                <IconButton disabled={!atcs.length} onClick={() => setAtcSearch(atcSearchRef.current?.value || '')}>
                  <Search color={!atcs.length ? 'disabled' : 'primary'} />
                </IconButton>
              )
            }}
          />
        </Box>
        <Stack bgcolor={atcs.length ? 'success.main' : 'error.main'}>
          <Typography align='center' fontSize={8} color={theme.palette.primary.contrastText}>
            IVAO ACTIVE TOWER CONTROL
          </Typography>
        </Stack>
      </Paper>
      {isLoading ? (
        <Box>
          <LinearProgress />
        </Box>
      ) : (
        filteredAtcs.map((atc) => (
          <StyledPaper key={atc.id}>
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
          </StyledPaper>
        ))
      )}
    </Box>
  )
}

export default IvaoAtcs

const StyledPaper = styled(Paper)`
  background: var(--mui-overlays-24);
  /* background: ${({ theme }) =>
    `linear-gradient(to bottom left, ${
      theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200]
    }, ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.common.white});`}; */
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  width: 100%;
  border-radius: 0;
  border-bottom: 1px solid var(--mui-palette-grey-A700);
  transition: all 125ms ease-out;

  &:hover {
    filter: brightness(80%);
    background: var(--mui-overlays-1);

    /* background: linear-gradient(to top right, #19203f, #303d79); */
  }
`
