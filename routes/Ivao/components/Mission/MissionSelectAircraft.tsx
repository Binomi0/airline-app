import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import { formatNumber } from 'utils'
import BlockIcon from '@mui/icons-material/Block'
import { ownedAircraftNftStore } from 'store/aircraftNFT.atom'
import { useRecoilValue } from 'recoil'
import { INft } from 'models/Nft'

interface Props {
  aircraft: string
  aircrafts: INft[]
  currentAircraft?: INft
  // eslint-disable-next-line no-unused-vars
  handleChange: (event: SelectChangeEvent) => void
  hasEnoughFuel: () => boolean
  requiredGas: () => number
  gasBalance?: bigint
  active: boolean
}

const MissionSelectAircraft = ({
  aircraft,
  aircrafts,
  currentAircraft,
  gasBalance,
  active,
  handleChange,
  hasEnoughFuel,
  requiredGas
}: Props) => {
  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)
  const missingAircrafts = useMemo(
    () => aircrafts.filter((a) => ownedAircrafts && !ownedAircrafts.some((o) => o.id.toString() === a.id.toString())),
    [aircrafts, ownedAircrafts]
  )

  if (!ownedAircrafts) return null
  return (
    <Stack direction='row' spacing={2} p={2}>
      <Stack justifyContent='space-between' spacing={2}>
        <Box>
          <FormControl fullWidth>
            <InputLabel size={ownedAircrafts.length === 0 ? 'small' : 'normal'} id='select-mission-aircarft-label'>
              Seleccionar Aeronave
            </InputLabel>
            <Select
              size={ownedAircrafts.length === 0 ? 'small' : 'medium'}
              autoFocus={ownedAircrafts.length > 0}
              disabled={ownedAircrafts.length === 0}
              error={!hasEnoughFuel() || ownedAircrafts.length === 0}
              color='primary'
              fullWidth
              autoWidth
              labelId='select-mission-aircarft-label'
              id='select-mission-aircarft'
              value={aircraft}
              label='Seleccionar Aeronave'
              onChange={handleChange}
              sx={{ minWidth: 250 }}
            >
              <MenuItem value='-1' />
              {ownedAircrafts?.map((ownedAircraft) => (
                <MenuItem
                  sx={{ minWidth: 250 }}
                  key={ownedAircraft.id.toString()}
                  disabled={currentAircraft && !hasEnoughFuel()}
                  value={ownedAircraft.id.toString()}
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
                  key={ownedAircraft.id.toString()}
                  disabled
                  value={ownedAircraft.id.toString()}
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
          <Typography color={hasEnoughFuel() ? 'success.main' : 'error.main'}>
            Combustible disponible:{' '}
            <b>{formatNumber(Number(gasBalance !== undefined ? Number(gasBalance) / 1e18 : 0), 0)} Litros</b>
          </Typography>
          {active && (
            <Typography color={hasEnoughFuel() ? 'success.main' : 'error.main'}>
              Combustible requerido: <b>{formatNumber(requiredGas(), 0)} Litros</b>
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default MissionSelectAircraft
