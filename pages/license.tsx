import { Sepolia } from '@thirdweb-dev/chains'
import type { NextPage } from 'next'
import { Box, Button, Container, Typography } from '@mui/material'
import LicenseMarketPlace from '../components/LicenseMarketPlace'
import styles from 'styles/License.module.css'
import image from 'public/img/airplanes4.png'
import Image from 'next/image'
import serverSidePropsHandler from 'components/ServerSideHandler'
import { useConnect, localWallet, useUser, ConnectWallet, useWallet } from '@thirdweb-dev/react'
import { useCallback } from 'react'
import { LocalWallet } from '@thirdweb-dev/wallets'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useAlchemyWallet from 'hooks/useAlchemyWallet'

const License: NextPage = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <Image priority className={styles.background} src={image} alt='banner' fill />

      <Container>
        <Box my={5} textAlign='center'>
          <Typography variant='h1'>License Page</Typography>
          {/* {!isLoggedIn && <ConnectWallet />} */}
        </Box>

        <LicenseMarketPlace />
      </Container>
    </Box>
  )
}

export const getServerSideProps = serverSidePropsHandler

export default License
