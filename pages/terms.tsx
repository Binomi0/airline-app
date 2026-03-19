import React from 'react'
import LegalLayout from 'components/LegalLayout/LegalLayout'
import { Typography } from '@mui/material'
import styles from 'styles/Legal.module.css'

const TermsAndConditions = () => {
  return (
    <LegalLayout title='Términos y Condiciones'>
      <Typography variant='h2' className={styles.sectionTitle}>
        1. Aceptación de los Términos
      </Typography>
      <Typography className={styles.text}>
        Al acceder y utilizar WeiFly, usted acepta estar sujeto a estos Términos y Condiciones y a todas las leyes y
        regulaciones aplicables.
      </Typography>

      <Typography variant='h2' className={styles.sectionTitle}>
        2. Naturaleza del Servicio
      </Typography>
      <Typography className={styles.text}>
        WeiFly es una plataforma de aerolínea virtual para fines de entretenimiento y simulación aérea. Los tokens AIRG
        y AIRL no tienen valor financiero garantizado fuera del ecosistema WeiFly y la aviación virtual no implica
        riesgos económicos reales.
      </Typography>

      <Typography variant='h2' className={styles.sectionTitle}>
        3. Uso de Cuentas Smart (Thirdweb)
      </Typography>
      <Typography className={styles.text}>
        El usuario es responsable de la custodia de sus passkeys y claves de acceso. WeiFly utiliza tecnología de
        Thirdweb para facilitar la creación de cuentas deterministas, pero la seguridad final depende del dispositivo
        del usuario.
      </Typography>

      <Typography variant='h2' className={styles.sectionTitle}>
        4. Conducta del Usuario
      </Typography>
      <Typography className={styles.text}>
        Se espera que los usuarios mantengan un comportamiento respetuoso dentro de la comunidad y sigan las normativas
        de IVAO cuando utilicen la integración de vuelo en red. El uso de exploits o trampas resultará en la suspensión
        de la cuenta.
      </Typography>

      <Typography variant='h2' className={styles.sectionTitle}>
        5. Limitación de Responsabilidad
      </Typography>
      <Typography className={styles.text}>
        WeiFly se proporciona &quot;tal cual&quot; sin garantías de ningún tipo. No nos hacemos responsables de pérdidas
        de activos digitales debido a errores de software o mal uso de la tecnología blockchain.
      </Typography>
    </LegalLayout>
  )
}

export default TermsAndConditions
