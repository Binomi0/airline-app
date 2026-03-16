import Search from '@mui/icons-material/Search'
import React, { startTransition, useCallback, useRef, useState } from 'react'
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
import { styled } from '@mui/material'
import styles from '../styles/ivao.module.css'
import axios, { AxiosError } from 'axios'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { authStore } from 'store/auth.atom'
import { destinationStore } from 'store/destination.atom'

const ZERO = 0
const TWENTY_FIVE = 25

const filterAtcs = (search?: string) => (atc: Atc) =>
  search ? atc.callsign.toLowerCase().includes(search.toLowerCase()) : true
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

let counter = 0
const IvaoAtcs = ({ start, end, onSelect }: Props) => {
  const token = useRecoilValue(authStore)
  const { atcs, initIvaoAuth } = useVaProviderContext()
  const theme = useTheme()
  const atcSearchRef = useRef<HTMLInputElement>()
  const setDestinations = useSetRecoilState(destinationStore)
  const [atcSearch, setAtcSearch] = useState<string>('')
  const [selected, setSelected] = useState('')

  const filteredAtcs = atcs.filter(filterAtcs(atcSearch)).slice(ZERO, TWENTY_FIVE).sort(sortByCallsign)

  const onSelectTower = useCallback(
    (callsign: string) => {
      if (start === callsign) return
      if (counter > 0) return
      counter++
      // axios.get('http://localhost:3001/ivao/init').then(() => {
      // axios
      //   .get(`http://localhost:3001/ivao/matrix/${callsign}`, {
      axios
        .get(`api/ivao/atc/matrix/${callsign}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          startTransition(() => {
            setDestinations(response.data)
            setSelected(callsign)
            onSelect(callsign, 'start')
          })
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            console.log('Error de auth en ivao, probando de nuevo initIvaoAuth')
            initIvaoAuth()
          }
          console.error(err)
        })
        .finally(() => {
          counter = 0
        })
      // })
    },
    [start, token, setDestinations, onSelect, initIvaoAuth]
  )

  return (
    <Box
      minWidth={300}
      height='calc(100vh - 64px)'
      borderRight='1px solid var(--mui-palette-grey-800)'
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
      {filteredAtcs.map((atc) => (
        <StyledPaper key={atc.id} onClick={() => onSelectTower(atc.callsign)} selected={selected === atc.callsign}>
          <Stack direction='row' justifyContent='space-between' p={1}>
            <Box>
              <Typography variant='subtitle1'>
                {atc.atcPosition.airportId}{' '}
                <Typography fontWeight={300} variant='caption' color='gray'>
                  {atc.atcPosition.atcCallsign.split('Tower')[0]}
                </Typography>
              </Typography>
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
                onClick={(e) => {
                  e.stopPropagation()
                  if (start === atc.callsign) return
                  onSelectTower(atc.callsign)
                }}
                className={styles.icon}
                fontSize='small'
              />
              <FlightLandIcon
                color={end === atc.callsign ? 'info' : 'inherit'}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(atc.callsign === end ? '' : atc.callsign, 'end')
                }}
                className={styles.icon}
                fontSize='small'
              />
            </Stack>
          </Stack>
        </StyledPaper>
      ))}
    </Box>
  )
}

export default IvaoAtcs

const StyledPaper = styled(Paper)<{ selected: boolean }>`
  background: ${({ selected, theme }) =>
    selected
      ? theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[500]
      : theme.palette.mode === 'dark'
        ? theme.palette.grey[900]
        : theme.palette.grey[100]};
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

  &:active {
    background: red;
  }
`
