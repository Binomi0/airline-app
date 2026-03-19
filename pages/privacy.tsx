import React from 'react'
import LegalLayout from 'components/LegalLayout/LegalLayout'
import { Typography } from '@mui/material'
import styles from 'styles/Legal.module.css'

const PrivacyPolicy = () => {
  return (
    <LegalLayout title='Política de Privacidad'>
      <Typography variant='h2' className={styles.sectionTitle}>
        1. Introducción
      </Typography>
      <Typography className={styles.text}>
        En WeiFly, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad describe
        cómo recopilamos, usamos y protegemos su información cuando utiliza nuestra plataforma de aerolínea virtual
        descentralizada.
      </Typography>

      <Typography variant='h2' className={styles.sectionTitle}>
        2. Información que Recopilamos
      </Typography>
      <Typography className={styles.text}>
        Como plataforma basada en blockchain, la mayor parte de su interacción es pública por naturaleza. Recopilamos su
        dirección de billetera (EOA), datos de vuelo de IVAO (si se conecta), y preferencias de configuración local.
      </Typography>

      <Typography variant='h2' className={styles.sectionTitle}>
        3. Uso de la Información
      </Typography>
      <Typography className={styles.text}>
        Utilizamos la información recopilada para gestionar su carrera en la aerolínea, procesar recompensas en tokens
        AIRG, y mejorar la experiencia de simulación. No vendemos sus datos a terceros.
      </Typography>

      <Typography variant='h2' className={styles.sectionTitle}>
        4. Cookies y Almacenamiento Local
      </Typography>
      <Typography className={styles.text}>
        Utilizamos almacenamiento local y cookies técnicas para mantener su sesión activa y recordar sus preferencias de
        tema (Oscuro/Claro).
      </Typography>

      <Typography variant='h2' className={styles.sectionTitle}>
        5. Cambios en esta Política
      </Typography>
      <Typography className={styles.text}>
        Nos reservamos el derecho de actualizar esta política en cualquier momento. Le recomendamos que revise esta
        página periódicamente para estar al tanto de cualquier cambio.
      </Typography>
    </LegalLayout>
  )
}

export default PrivacyPolicy
