import React, { memo } from 'react'
import GasAvailable from './GasAvailable'
import GasDeposited from './GasDeposited'
import GasFarmed from './GasFarmed'
import GasSupply from './components/GasSupply'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import styles from 'styles/Gas.module.css'

interface Props {
  airl?: Readonly<bigint>
  staking?: readonly [bigint, bigint, bigint, bigint]
  getAirlBalance: () => void
  getStakingInfo: () => void
  getAirgBalance: () => void
}

const GasStationView = ({ airl, staking, getAirlBalance, getAirgBalance, getStakingInfo }: Props) => {
  return (
    <Box mt={4}>
      <Box className={styles.glassCard} mb={4}>
        <Typography variant='h5' fontWeight={700} color='#6366f1'>
          Checklist de Operaciones
        </Typography>
        <Typography variant='body1' sx={{ opacity: 0.8 }}>
          Deposita tus tokens AIRL en el staking para empezar a generar combustible (AIRG) de forma pasiva. 
          El combustible es esencial para todas tus misiones de vuelo.
        </Typography>
        <GasSupply />
      </Box>

      <Grid container spacing={3}>
        <GasAvailable airl={airl} getAirlBalance={getAirlBalance} getStakingInfo={getStakingInfo} />
        <GasDeposited staking={staking} getStakingInfo={getStakingInfo} getAirlBalance={getAirlBalance} />
        <GasFarmed getAirgBalance={getAirgBalance} />
      </Grid>

      <Box mt={6} className={styles.glassCard}>
        <Typography variant='h4' fontWeight={800} gutterBottom>
          ¿Cómo funciona?
        </Typography>
        <Typography paragraph sx={{ opacity: 0.8 }}>
          Para llenar tus tanques y volar, simplemente añade tokens AIRL a la Gas Station. Este mecanismo proporciona un 
          flujo constante de gasolina por minuto. Una vez que tengas al menos <b>100 litros</b> listos para recolectar, 
          el botón CLAIM se desbloqueará y podrás transferir todo el combustible a tu wallet.
        </Typography>
        
        <Typography variant='h5' fontWeight={700} mt={2}>
          Ratio de Conversión
        </Typography>
        <Typography sx={{ opacity: 0.8 }}>
          Obtendrás 100 Litros por cada 1 token AIRL stakeado durante 24 horas. 
          (100 AIRG / 1 AIRL / 24h)
        </Typography>
      </Box>
    </Box>
  )
}

export default memo(GasStationView)
