import type { NextPage } from 'next'
import { Box, Container, Typography } from '@mui/material'

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
