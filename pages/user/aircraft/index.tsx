import type { NextPage } from 'next'

import serverSidePropsHandler from 'components/ServerSideHandler'
import GradientCard from 'components/GradientCard'
import { nftAircraftTokenAddress } from 'contracts/address'
import useOwnedNfts from 'hooks/useOwnedNFTs'
import { useCallback, useState } from 'react'
import { useTokenProviderContext } from 'context/TokenProvider'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { darken, useTheme } from '@mui/material/styles'
import Paper from '@mui/material/Paper'

const UserAircrafts: NextPage = () => {
  const theme = useTheme()
  const { data, isLoading, error } = useOwnedNfts(nftAircraftTokenAddress)
  const { airg } = useTokenProviderContext()
  const [isRefueling, setIsRefueling] = useState(false)

  const handleRefuelAircraft = useCallback(() => {
    setIsRefueling((s) => !s)
  }, [])

  if (error) return null
  if (isLoading) return null

  console.log({ data })
  return (
    <Box
      position='relative'
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 70px)',
        background: `linear-gradient(45deg,${darken(theme.palette.primary.dark, 0.7)},${darken(
          theme.palette.primary.main,
          0.99
        )})`
      }}
    >
      <Container sx={{ pt: 2 }}>
        <Typography>My Aircrafts</Typography>
        <Typography>
          Fuel Available:{' '}
          {Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
            airg?.toNumber() || 0
          )}{' '}
          Liters
        </Typography>
        <Grid>
          {data.map((aircraft) => (
            <GradientCard
              key={aircraft.tokenId}
              from={darken(theme.palette.primary.main, 0.9)}
              to={darken(theme.palette.primary.main, 0.5)}
            >
              <Box p={1} color={theme.palette.common.white}>
                <Typography variant='subtitle1'>{aircraft.name}</Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell align='right'>Fuel onboard</TableCell>
                        <TableCell align='right'>Capacity</TableCell>
                        <TableCell align='right'>Cargo</TableCell>
                        <TableCell align='right'>Price</TableCell>
                        <TableCell align='right'>license</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component='th' scope='row' align='right'>
                          {122}
                        </TableCell>
                        {aircraft.raw.metadata.attributes.map((attribute: { trait_type: string; value: string }) => (
                          <TableCell key={attribute.trait_type} component='th' scope='row' align='right'>
                            <Typography variant='body2' fontWeight={600}>
                              {attribute.value.toString()}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack>
                  <Button
                    color='info'
                    disabled={isRefueling}
                    size='small'
                    variant='contained'
                    onClick={handleRefuelAircraft}
                  >
                    Get Gas
                  </Button>
                </Stack>
              </Box>
            </GradientCard>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default UserAircrafts
