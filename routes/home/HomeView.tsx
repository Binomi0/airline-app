import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import List from '@mui/material/List'
import HomeGridItem from 'components/HomeGridItem'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import FlightIcon from '@mui/icons-material/Flight'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import SecurityIcon from '@mui/icons-material/Security'
import Stack from '@mui/material/Stack'

const HomeView = () => {
  return (
    <Container>
      <Stack my={4} textAlign='center' height='100vh' alignItems='center' justifyContent='center'>
        <Typography variant='h1'>WeiFly</Typography>
        <Typography variant='h2'>Decentralized Virtual Airline</Typography>
      </Stack>

      <Box>
        <Paper elevation={3}>
          <Box p={2}>
            <Paper elevation={12}>
              <Box p={2}>
                <Typography variant='h4' gutterBottom>
                  Welcome to WeiFly!
                </Typography>
                <Typography variant='body1' paragraph>
                  WeiFly is a decentralized virtual airline powered by blockchain technology. We`re revolutionizing the
                  aviation industry by providing users with ownership and control over their virtual aircraft,
                  transparent operations, and community-driven governance.
                </Typography>
              </Box>
            </Paper>
            <Paper elevation={12}>
              <Box p={2} my={8}>
                <Typography variant='h5' gutterBottom>
                  Benefits of WeiFly:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={24}>
                      <Box p={2}>
                        <Typography variant='body2' color='textSecondary' paragraph>
                          <strong>Decentralized Ownership:</strong> With WeiFly, you truly own your virtual aircraft as
                          non-fungible tokens (NFTs) on the blockchain. No centralized authority can take away your
                          ownership rights.
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={24}>
                      <Box p={2}>
                        <Typography variant='body2' color='textSecondary' paragraph>
                          <strong>Transparent Operations:</strong> Our platform leverages blockchain technology to
                          provide transparent and immutable records of flight operations, ticket sales, and aircraft
                          ownership.
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={24}>
                      <Box p={2}>
                        <Typography variant='body2' color='textSecondary' paragraph>
                          <strong>Community-Driven Governance:</strong> WeiFly is governed by its community of users.
                          Through decentralized decision-making mechanisms, users have a say in the direction of the
                          platform and its future development.
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  {/* Add more benefits as needed */}
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Paper>
      </Box>

      <Box my={8}>
        <Paper elevation={3}>
          <Box p={2}>
            <Typography variant='h4' gutterBottom>
              Key Features
            </Typography>
            <List>
              <Paper elevation={12}>
                <Box mb={1}>
                  <ListItem>
                    <Stack direction='row' spacing={2}>
                      <VerifiedUserIcon color='primary' />
                      <ListItemText primary='Decentralized Booking and Ticketing System' />
                    </Stack>
                  </ListItem>
                </Box>
              </Paper>
              <Paper elevation={12}>
                <Box mb={1}>
                  <ListItem>
                    <Stack direction='row' spacing={2}>
                      <FlightIcon color='primary' />
                      <ListItemText primary='Ownership of Virtual Aircraft as Non-Fungible Tokens (NFTs)' />
                    </Stack>
                  </ListItem>
                </Box>
              </Paper>
              <Paper elevation={12}>
                <Box mb={1}>
                  <ListItem>
                    <Stack direction='row' spacing={2}>
                      <MonetizationOnIcon color='primary' />
                      <ListItemText primary='Ability to Earn Rewards or Dividends through Participation in the Ecosystem' />
                    </Stack>
                  </ListItem>
                </Box>
              </Paper>
              <Paper elevation={12}>
                <Box>
                  <ListItem>
                    <Stack direction='row' spacing={2}>
                      <SecurityIcon color='primary' />
                      <ListItemText primary='Integration with Ethereum Blockchain for Transparent and Secure Transactions' />
                    </Stack>
                  </ListItem>
                </Box>
              </Paper>
            </List>
          </Box>
        </Paper>
      </Box>

      <Box my={8}>
        <Paper elevation={3}>
          <Box p={2}>
            <Typography variant='h4' gutterBottom>
              How It Works
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={12} sx={{ padding: 2 }}>
                  <Typography variant='h6' gutterBottom>
                    Step 1: Register an Account
                  </Typography>
                  <Typography variant='body1' paragraph>
                    Sign up for a WeiFly account using your email address and create a password.
                  </Typography>
                  {/* Add visual aids like diagrams or screenshots if needed */}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={12} sx={{ padding: 2 }}>
                  <Typography variant='h6' gutterBottom>
                    Step 2: Book Flights
                  </Typography>
                  <Typography variant='body1' paragraph>
                    Browse available flights, select your desired route and dates, and book your tickets using Ethereum
                    or other supported cryptocurrencies.
                  </Typography>
                  {/* Add visual aids like diagrams or screenshots if needed */}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={12} sx={{ padding: 2 }}>
                  <Typography variant='h6' gutterBottom>
                    Step 3: Manage Your Virtual Aircraft
                  </Typography>
                  <Typography variant='body1' paragraph>
                    Access your virtual aircraft NFTs, view their details, and manage their ownership or leasing status.
                  </Typography>
                  {/* Add visual aids like diagrams or screenshots if needed */}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Box my={8}>
        <Paper>
          <Box p={2}>
            <Typography variant='h4' gutterBottom>
              Benefits
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={12}>
                  <Box p={2}>
                    <Typography variant='h6' gutterBottom>
                      Greater Control and Ownership
                    </Typography>
                    <Typography variant='body1' paragraph>
                      With WeiFly, users have greater control and ownership of their virtual aircraft assets as
                      non-fungible tokens (NFTs) on the blockchain.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={12}>
                  <Box p={2}>
                    <Typography variant='h6' gutterBottom>
                      Lower Fees and Transparent Pricing
                    </Typography>
                    <Typography variant='body1' paragraph>
                      WeiFly offers lower fees and more transparent pricing compared to traditional airlines, thanks to
                      its decentralized nature and blockchain technology.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={12}>
                  <Box p={2}>
                    <Typography variant='h6' gutterBottom>
                      Community Engagement and Collaboration
                    </Typography>
                    <Typography variant='body1' paragraph>
                      Participate in WeiFly`s vibrant community, engage with other users, and collaborate on the future
                      development of the platform through decentralized governance mechanisms.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Grid container spacing={8} my={8}>
        <HomeGridItem delay={500} link='/hangar' title='Hangar &rarr;' text="Aircrafts, buy and sell aircraft NFT's" />
        <HomeGridItem
          delay={1000}
          link='/license'
          title='Licencias &rarr;'
          text='Grow, adquire a licence and start flying today.'
        />

        <HomeGridItem
          delay={1500}
          link='/gas'
          title='Gas Station &rarr;'
          text='Stake and earn Gas to refuel your aircrafts.'
        />
        <HomeGridItem
          delay={2000}
          link='/cargo'
          title='Cargo &rarr;'
          text='Realiza alguno de los vuelos pendientes y gana tokens AIRL.'
        />
        <HomeGridItem
          delay={2500}
          link='/ivao'
          title='IVAO &rarr;'
          text='Monitoriza tus vuelos en IVAO y gana recompensas.'
        />
      </Grid>
    </Container>
  )
}

export default HomeView
