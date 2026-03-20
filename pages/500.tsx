import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'

const Error500: NextPage = () => {
  return (
    <Container>
      <Box my={10} textAlign='center'>
        <Typography variant='h1'>Ha ocurrido un error</Typography>
      </Box>
    </Container>
  )
}

export default Error500
