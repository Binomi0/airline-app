import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { formatNumber } from 'utils'
import BigNumber from 'bignumber.js'
import { NFT } from '@thirdweb-dev/sdk'
import { useAircraftProviderContext } from 'context/AircraftProvider'
import BlockIcon from '@mui/icons-material/Block'
import { useTheme } from '@mui/material'

interface Props {
  aircraft: string
  aircrafts: NFT[]
  currentAircraft?: NFT
  // eslint-disable-next-line no-unused-vars
  handleChange: (event: SelectChangeEvent) => void
  hasEnoughFuel: () => boolean
  requiredGas: () => BigNumber
  gasBalance?: BigNumber
  active: boolean
}

const CargoSelectAircraft = ({
  aircraft,
  aircrafts,
  currentAircraft,
  gasBalance,
  active,
  handleChange,
  hasEnoughFuel,
  requiredGas
}: Props) => {
  const theme = useTheme()
  const { ownedAircrafts } = useAircraftProviderContext()
  const missingAircrafts = useMemo(
    () => aircrafts.filter((a) => !ownedAircrafts.some((o) => o.metadata.id === a.metadata.id)),
    [aircrafts, ownedAircrafts]
  )

  return (
    <Stack direction='row' spacing={2} p={2}>
      <Stack justifyContent='space-between' spacing={2}>
        <Box>
          <FormControl fullWidth>
            <InputLabel size={ownedAircrafts.length === 0 ? 'small' : 'normal'} id='select-cargo-aircarft-label'>
              Select an Aircraft
            </InputLabel>
            <Select
              size={ownedAircrafts.length === 0 ? 'small' : 'medium'}
              autoFocus={ownedAircrafts.length > 0}
              disabled={ownedAircrafts.length === 0}
              error={!hasEnoughFuel() || ownedAircrafts.length === 0}
              color='primary'
              fullWidth
              autoWidth
              labelId='select-cargo-aircarft-label'
              id='select-cargo-aircarft'
              value={aircraft}
              label='Select an Aircraft'
              onChange={handleChange}
              sx={{ minWidth: 250 }}
            >
              <MenuItem value='-1' />
              {ownedAircrafts?.map((ownedAircraft) => (
                <MenuItem
                  sx={{ minWidth: 250 }}
                  key={ownedAircraft.metadata.id}
                  disabled={currentAircraft && !hasEnoughFuel()}
                  value={ownedAircraft.metadata.id}
                >
                  <Stack direction='row' justifyContent='space-between'>
                    <Typography fontWeight={500}>{ownedAircraft.metadata.name}</Typography>
                    {currentAircraft && !hasEnoughFuel() && <BlockIcon fontSize='small' />}
                  </Stack>
                </MenuItem>
              ))}
              {missingAircrafts?.map((ownedAircraft) => (
                <MenuItem
                  sx={{ minWidth: 250 }}
                  key={ownedAircraft.metadata.id}
                  disabled
                  value={ownedAircraft.metadata.id}
                  aria-disabled
                >
                  <Stack direction='row' justifyContent='space-between' width='100%'>
                    <Typography>{ownedAircraft.metadata.name}</Typography>
                    <Box>
                      <BlockIcon fontSize='small' />
                    </Box>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography
            color={
              theme.palette.mode === 'dark'
                ? `${hasEnoughFuel() ? 'success' : 'error'}.light`
                : `${hasEnoughFuel() ? 'success' : 'error'}.dark`
            }
          >
            Fuel available: <b>{formatNumber(gasBalance?.toNumber(), 0)} Liters</b>
          </Typography>
          {active && (
            <Typography
              color={
                theme.palette.mode === 'dark'
                  ? `${hasEnoughFuel() ? 'success' : 'error'}.light`
                  : `${hasEnoughFuel() ? 'success' : 'error'}.dark`
              }
            >
              Fuel required: <b>{formatNumber(requiredGas().toNumber(), 0)} Liters</b>
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default CargoSelectAircraft
