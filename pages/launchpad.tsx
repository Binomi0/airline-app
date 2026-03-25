import type { NextPage } from 'next'
import LaunchpadLanding from 'routes/launchpad/LaunchpadLanding'
import Head from 'next/head'

const LaunchpadPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>WeiFly | El Futuro de la Simulación de Vuelo Descentralizada</title>
        <meta
          name='description'
          content='Conviértete en piloto en la primera aerolínea virtual sobre blockchain. Vuela en MSFS/X-Plane, gana tokens AIRL y gestiona tu flota NFT.'
        />
        <meta
          name='keywords'
          content='simulación de vuelo, blockchain, nft, play to earn, fly to earn, weifly, airl, airg'
        />
      </Head>
      <LaunchpadLanding />
    </>
  )
}

export default LaunchpadPage
