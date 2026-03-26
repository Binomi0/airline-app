import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  LinearProgress,
  Divider,
  Stack,
  Chip,
  IconButton,
  useTheme,
  alpha
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  FlightTakeoff,
  Timeline,
  EmojiEvents,
  AirplanemodeActive,
  Hub,
  History,
  TrendingUp,
  AccountBalanceWallet,
  Timer
} from '@mui/icons-material'
import moment from 'moment'
import axios from 'axios'
import Link from 'next/link'
import Head from 'next/head'
import { fetcher } from 'utils'

// Styled Components to avoid 'sx'
const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}))

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main
}))

const RankItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderRadius: 12,
  background: alpha(theme.palette.background.paper, 0.5),
  marginBottom: theme.spacing(1),
  '&:last-child': {
    marginBottom: 0
  }
}))

const ProgressLabel = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4
})

const RecentMissionItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderLeft: `3px solid ${theme.palette.primary.main}`,
  background: alpha(theme.palette.background.paper, 0.3),
  borderRadius: '0 12px 12px 0',
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}))

const StatsPage = () => {
  const theme = useTheme()

  const { data: globalStats, isLoading: globalLoading } = useQuery({
    queryKey: ['globalStats'],
    queryFn: async () => await fetcher('/api/stats/global')
  })

  const { data: rankings, isLoading: rankingsLoading } = useQuery({
    queryKey: ['rankings'],
    queryFn: async () => await fetcher('/api/stats/rankings')
  })

  if (globalLoading || rankingsLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 8 }}>
        <LinearProgress />
      </Container>
    )
  }

  const totals = globalStats?.totals || { totalMissions: 0, totalDistance: 0, totalRewards: 0 }
  const maxAircraftCount = globalStats?.aircraftPopularity?.[0]?.count || 1

  return (
    <Container maxWidth='lg' sx={{ py: 6, mt: 8 }}>
      <Head>
        <title>Analytics · WeiFly Stats</title>
        <meta
          name='description'
          content='Estadísticas globales de la red de vuelo WeiFly. Rankings de pilotos, hubs y flota.'
        />
      </Head>
      <Box mb={6}>
        <Typography variant='h3' gutterBottom fontWeight={800} sx={{ color: theme.palette.text.primary }}>
          WeiFly Analytics
        </Typography>
        <Typography variant='h6' sx={{ color: theme.palette.text.secondary }}>
          Panel global de rendimiento y curiosidades de la flota desentralizada.
        </Typography>
      </Box>

      {/* ── Global Totals ───────────────────────────────────────── */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} md={4}>
          <StatsCard variant='glass'>
            <IconWrapper>
              <FlightTakeoff fontSize='large' />
            </IconWrapper>
            <Typography variant='body2' color='textSecondary' fontWeight={600}>
              MISIONES COMPLETADAS
            </Typography>
            <Typography variant='h4' fontWeight={800} mt={1}>
              {totals.totalMissions.toLocaleString()}
            </Typography>
            <Box mt={2}>
              <Chip icon={<TrendingUp />} label='+12% esta semana' size='small' color='success' variant='outlined' />
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard variant='glass'>
            <IconWrapper sx={{ color: '#10B981', background: alpha('#10B981', 0.1) }}>
              <Timeline fontSize='large' />
            </IconWrapper>
            <Typography variant='body2' color='textSecondary' fontWeight={600}>
              DISTANCIA TOTAL (NM)
            </Typography>
            <Typography variant='h4' fontWeight={800} mt={1}>
              {Math.round(totals.totalDistance).toLocaleString()}
            </Typography>
            <Typography variant='caption' color='textSecondary' mt={1}>
              Suficiente para dar la vuelta al mundo {Math.floor(totals.totalDistance / 21639)} veces.
            </Typography>
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard variant='glass'>
            <IconWrapper sx={{ color: '#F59E0B', background: alpha('#F59E0B', 0.1) }}>
              <AccountBalanceWallet fontSize='large' />
            </IconWrapper>
            <Typography variant='body2' color='textSecondary' fontWeight={600}>
              RECOMPENSAS AIRL
            </Typography>
            <Typography variant='h4' fontWeight={800} mt={1}>
              {Math.round(totals.totalRewards).toLocaleString()}
            </Typography>
            <Typography variant='caption' color='textSecondary' mt={1}>
              Token de utilidad de Arbitrum L2.
            </Typography>
          </StatsCard>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* ── Top Pilots by Earnings ─────────────────────────────── */}
        <Grid item xs={12} md={8}>
          <Typography variant='h5' fontWeight={700} mb={3}>
            Ranking de Pilotos de Élite
          </Typography>
          <Grid container spacing={2}>
            {rankings?.effective?.slice(0, 3).map((pilot: any, index: number) => (
              <Grid item xs={12} key={pilot._id}>
                <RankItem>
                  <Typography variant='h6' sx={{ minWidth: 40, fontWeight: 800, color: theme.palette.primary.main }}>
                    #0{index + 1}
                  </Typography>
                  <Avatar sx={{ width: 44, height: 44, mr: 2, background: theme.palette.divider }}>
                    {pilot.pilotId[0]}
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant='subtitle1' fontWeight={700}>
                      {pilot.pilotId}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      {pilot.count} misiones completadas
                    </Typography>
                  </Box>
                  <Box textAlign='right'>
                    <Typography variant='subtitle1' fontWeight={800} color='primary'>
                      {Math.round(pilot.value).toLocaleString()} AIRL
                    </Typography>
                  </Box>
                </RankItem>
              </Grid>
            ))}
          </Grid>

          {/* ── Busiest Hubs ───────────────────────────────────────── */}
          <Box mt={6}>
            <Typography variant='h5' fontWeight={700} mb={3}>
              Hubs Más Concurridos
            </Typography>
            <Box display='flex' flexWrap='wrap' gap={1}>
              {globalStats?.hubs?.map((hub: any) => (
                <Chip
                  key={hub._id}
                  icon={<Hub />}
                  label={`${hub._id} (${hub.total})`}
                  variant='outlined'
                  sx={{ py: 2.5, px: 1, borderRadius: '8px', fontWeight: 600 }}
                />
              ))}
            </Box>
          </Box>

          {/* ── Efficiency & Success ───────────────────────────────── */}
          <Box mt={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StatsCard variant='glass'>
                  <IconWrapper sx={{ color: '#8B5CF6', background: alpha('#8B5CF6', 0.1) }}>
                    <Timer />
                  </IconWrapper>
                  <Typography variant='body2' color='textSecondary' fontWeight={600}>
                    TIEMPO MEDIO DE VUELO
                  </Typography>
                  <Typography variant='h5' fontWeight={800} mt={1}>
                    {Math.round(globalStats?.avgDuration || 0)} min
                  </Typography>
                </StatsCard>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatsCard variant='glass'>
                  <IconWrapper sx={{ color: '#EC4899', background: alpha('#EC4899', 0.1) }}>
                    <EmojiEvents />
                  </IconWrapper>
                  <Typography variant='body2' color='textSecondary' fontWeight={600}>
                    TASA DE ÉXITO
                  </Typography>
                  <Typography variant='h5' fontWeight={800} mt={1}>
                    {globalStats?.successRate?.total > 0
                      ? Math.round((globalStats.successRate.completed / globalStats.successRate.total) * 100)
                      : 100}
                    %
                  </Typography>
                </StatsCard>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* ── Right Column: Aircraft Popularity & Type Dist ───────── */}
        <Grid item xs={12} md={4}>
          <Typography variant='h5' fontWeight={700} mb={3}>
            Popularidad de Flota
          </Typography>
          <StatsCard variant='glass'>
            {globalStats?.aircraftPopularity?.map((ac: any) => (
              <Box key={ac._id} mb={2.5}>
                <ProgressLabel>
                  <Typography variant='body2' fontWeight={600}>
                    {ac._id}
                  </Typography>
                  <Typography variant='caption' fontWeight={700}>
                    {ac.count} vuelos
                  </Typography>
                </ProgressLabel>
                <LinearProgress
                  variant='determinate'
                  value={(ac.count / maxAircraftCount) * 100}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            ))}
          </StatsCard>

          <Box mt={6}>
            <Typography variant='h5' fontWeight={700} mb={3}>
              Tipos de Misión
            </Typography>
            <StatsCard variant='glass'>
              {globalStats?.typeDistribution?.map((type: any) => (
                <Box key={type._id} display='flex' justifyContent='space-between' alignItems='center' mb={1.5}>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: theme.palette.primary.main
                      }}
                    />
                    <Typography variant='body2' fontWeight={500}>
                      {type._id}
                    </Typography>
                  </Box>
                  <Typography variant='body2' fontWeight={700}>
                    {type.count}
                  </Typography>
                </Box>
              ))}
            </StatsCard>
          </Box>
        </Grid>
      </Grid>

      {/* ── Recent Activity ────────────────────────────────────── */}
      <Box mt={10}>
        <Stack direction='row' alignItems='center' spacing={1} mb={3}>
          <History color='primary' />
          <Typography variant='h5' fontWeight={700}>
            Actividad Reciente en la Red
          </Typography>
        </Stack>
        {globalStats?.recentActivity?.map((mission: any) => (
          <RecentMissionItem key={mission._id}>
            <Box display='flex' alignItems='center' gap={2}>
              <IconWrapper sx={{ mb: 0, width: 40, height: 40, borderRadius: '50%' }}>
                <AirplanemodeActive fontSize='small' />
              </IconWrapper>
              <Box>
                <Typography variant='subtitle2' fontWeight={700}>
                  {mission.callsign} · {mission.origin} → {mission.destination}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  {mission.aircraftId} · {Math.round(mission.distance)} nm
                </Typography>
              </Box>
            </Box>
            <Box textAlign='right'>
              <Typography variant='subtitle2' fontWeight={800} color='secondary'>
                +{Math.round(mission.rewards)} AIRL
              </Typography>
              <Typography variant='caption' color='textSecondary'>
                {moment(mission.updatedAt).fromNow()}
              </Typography>
            </Box>
          </RecentMissionItem>
        ))}
      </Box>

      {/* ── Footer Link ────────────────────────────────────────── */}
      <Box mt={10} textAlign='center'>
        <Link href='/' passHref>
          <IconButton
            sx={{ color: theme.palette.primary.main, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` }}
          >
            <TrendingUp />
          </IconButton>
        </Link>
        <Typography variant='body2' color='textSecondary' mt={1}>
          Estadísticas actualizadas cada 30 minutos.
        </Typography>
      </Box>
    </Container>
  )
}

export default StatsPage
