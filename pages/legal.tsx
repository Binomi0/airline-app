import React from 'react'
import LegalLayout from 'components/LegalLayout/LegalLayout'
import { Typography } from '@mui/material'
import styles from 'styles/Legal.module.css'

const LegalNotice = () => {
  return (
    <LegalLayout title="Aviso Legal">
      <Typography variant="h2" className={styles.sectionTitle}>1. Información del Titular</Typography>
      <Typography className={styles.text}>
        Este proyecto, WeiFly, es una plataforma descentralizada en desarrollo (Alpha). Para consultas legales o técnicas, puede contactarnos a través de nuestros canales oficiales de GitHub o redes sociales.
      </Typography>

      <Typography variant="h2" className={styles.sectionTitle}>2. Propiedad Intelectual</Typography>
      <Typography className={styles.text}>
        Todo el contenido, incluyendo logotipos, diseños y código fuente (según su licencia de repositorio), es propiedad de los desarrolladores de WeiFly o se utiliza bajo las licencias correspondientes de terceros (como MUI, Thirdweb, etc.).
      </Typography>

      <Typography variant="h2" className={styles.sectionTitle}>3. Enlaces Externos</Typography>
      <Typography className={styles.text}>
        Este sitio puede contener enlaces a sitios web de terceros, como IVAO.aero o exploradores de blockchain. WeiFly no se hace responsable del contenido o las prácticas de privacidad de dichos sitios externos.
      </Typography>

      <Typography variant="h2" className={styles.sectionTitle}>4. Legislación Aplicable</Typography>
      <Typography className={styles.text}>
        Dada la naturaleza global y descentralizada de la aplicación basada en Ethereum, los usuarios deben asegurarse de cumplir con las regulaciones locales sobre tenencia de activos digitales en sus respectivas jurisdicciones.
      </Typography>
    </LegalLayout>
  )
}

export default LegalNotice
