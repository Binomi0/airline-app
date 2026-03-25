import type { NextPage } from 'next'
import Head from 'next/head'
import CrowdfundingLanding from 'routes/crowdfunding/CrowdfundingLanding'

const CrowdfundingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Weifly 2.0 | Crowdfunding Aerolínea Virtual Descentralizada</title>
        <meta
          name='description'
          content='Únete al crowdfunding de Weifly 2.0. Tokeniza tu experiencia de vuelo, obtén licencias NFT y gana tokens AIRL volando.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {/* Open Graph Tags */}
        <meta property='og:title' content='Weifly 2.0 - Crowdfunding' />
        <meta
          property='og:description'
          content='La primera aerolínea virtual descentralizada del mundo. ¡Invierte ahora!'
        />
        <meta property='og:image' content='/img/hero_3d_plane.png' />
      </Head>
      <CrowdfundingLanding />
    </>
  )
}

export default CrowdfundingPage
