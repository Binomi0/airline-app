import React, { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from '../../styles/guide.module.css'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useTheme, alpha } from '@mui/material'

const STEPS = [
  {
    n: '01',
    label: 'IDENTIDAD',
    title: 'Smart Accounts & Passkeys',
    desc: 'Tu viaje empieza con una infraestructura de última generación. WeiFly utiliza Smart Accounts deterministas vinculadas a tus Passkeys. Esto significa seguridad biométrica total y transacciones patrocinadas sin necesidad de gestionar frases semilla complejas.',
    cta: 'Configurar Cuenta',
    link: '/login',
    img: '/guide/step1.png'
  },
  {
    n: '02',
    label: 'CERTIFICACIÓN',
    title: 'Licencias de Vuelo',
    desc: 'Antes de operar cualquier aeronave, debes certificar tus habilidades. Obtén tu licencia de piloto NFT para habilitar tu cuenta. Tu rango y capacidades crecerán a medida que acumules horas de vuelo verificadas en la red.',
    cta: 'Obtener Licencia',
    link: '/license',
    img: '/guide/step2.png'
  },
  {
    n: '03',
    label: 'FLOTA',
    title: 'Adquiere tu Aeronave',
    desc: 'Una vez certificado, es hora de elegir tu herramienta de trabajo. En el Hangar encontrarás aeronaves reales (Cessna, Boeing, Airbus) tokenizadas como NFTs. Cada avión tiene costes operativos y rendimientos específicos.',
    cta: 'Visitar Hangar',
    link: '/hangar',
    img: '/guide/step3.png'
  },
  {
    n: '04',
    label: 'ECONOMÍA',
    title: 'Staking & Combustible',
    desc: 'El ecosistema WeiFly utiliza una economía de doble token. Haz staking de AIRL para generar AIRG de forma pasiva. El AIRG es el combustible vital que tus aviones consumen en cada ruta para completar misiones.',
    cta: 'Repostar Ahora',
    link: '/gas',
    img: '/guide/step4.png'
  },
  {
    n: '05',
    label: 'OPERACIONES',
    title: 'Misiones & Red IVAO',
    desc: 'Selecciona una misión y vuela en la red IVAO. Nuestro sistema sincroniza tus datos de vuelo en tiempo real. Al aterrizar, el contrato inteligente verifica tu éxito y deposita tus recompensas directamente en tu Smart Account.',
    cta: 'Ver Mapa de Misiones',
    link: '/missions',
    img: '/guide/step5.png'
  }
]

const GuideView = () => {
  const theme = useTheme()

  const dynamicTokens = useMemo(
    () =>
      ({
        '--home-bg': theme.palette.background.default,
        '--home-bg-alt':
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.6)
            : alpha(theme.palette.background.paper, 0.65),
        '--home-bg-alt-rgb': theme.palette.mode === 'dark' ? '15, 18, 28' : '255, 255, 255',
        '--home-border': alpha(theme.palette.divider, 0.07),
        '--home-border-card': alpha(theme.palette.divider, 0.08),
        '--home-accent': theme.palette.primary.main,
        '--home-accent-soft': alpha(theme.palette.primary.main, 0.12),
        '--home-accent-text': theme.palette.primary.light,
        '--home-title': theme.palette.text.primary,
        '--home-muted': alpha(theme.palette.text.secondary, 0.85),
        '--home-hero-from': theme.palette.weifly.home.hero.from,
        '--home-hero-to': theme.palette.weifly.home.hero.to,
        '--home-accent-rgb':
          theme.palette.mode === 'dark' ? '99, 102, 241' : '79, 70, 229' /* Values for Indigo 500 and 600 */
      }) as React.CSSProperties,
    [theme]
  )

  return (
    <div className={styles.root} style={dynamicTokens}>
      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className={styles.title}>Ruta del Piloto</h1>
          <p className={styles.subtitle}>
            Tu camino hacia la excelencia en la primera aerolínea digital y descentralizada. Domina la tecnología Web3
            aplicada a la simulación de vuelo.
          </p>
        </motion.header>

        <section className={styles.timeline}>
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.n}
              className={styles.stepWrapper}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className={styles.marker} />

              <motion.div className={styles.card} whileHover={{ y: -10 }}>
                <span className={styles.stepLabel}>
                  {step.label} {step.n}
                </span>
                <h2 className={styles.stepTitle}>{step.title}</h2>
                <p className={styles.stepDesc}>{step.desc}</p>
                <Link href={step.link} className={styles.cta}>
                  {step.cta} <ArrowForwardIcon fontSize='small' />
                </Link>
              </motion.div>

              <motion.div className={styles.imageBox} whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
                <img src={step.img} alt={step.title} loading='lazy' />
              </motion.div>
            </motion.div>
          ))}
        </section>

        <motion.section
          className={styles.ctaSection}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.stepTitle}>Despegue Inmediato Patrocinado</h2>
          <p className={styles.stepDesc} style={{ margin: '0 auto 3rem', maxWidth: '600px' }}>
            Gracias a nuestro sistema de <strong>Gas Sponsorship</strong>, tus primeros vuelos están libres de
            comisiones de red. Conecta tu Passkey y empieza hoy mismo.
          </p>
          <Link href='/missions'>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={styles.ctaButton}>
              INICIAR OPERACIONES <ArrowForwardIcon />
            </motion.span>
          </Link>
        </motion.section>
      </div>
    </div>
  )
}

export default GuideView
