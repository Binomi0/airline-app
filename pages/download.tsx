import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import DownloadView from 'routes/download/DownloadView'

const DownloadPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Descargar App | WeiFly</title>
        <meta name='description' content='Descarga la aplicación de escritorio de WeiFly para conectar tu simulador y empezar a ganar recompensas.' />
      </Head>
      <DownloadView />
    </>
  )
}

export default DownloadPage
