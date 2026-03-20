import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'
import styles from '../../styles/guide.module.css'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

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

const THEME_TOKENS: Record<'dark' | 'light', React.CSSProperties> = {
  dark: {
    '--home-bg': '#0b0f19',
    '--home-bg-alt': 'rgba(15,18,28,0.6)',
    '--home-bg-alt-rgb': '15, 18, 28',
    '--home-border': 'rgba(255,255,255,0.06)',
    '--home-border-card': 'rgba(255,255,255,0.07)',
    '--home-accent': '#6366f1',
    '--home-accent-soft': 'rgba(99,102,241,0.12)',
    '--home-accent-text': '#a5b4fc',
    '--home-title': '#f8fafc',
    '--home-muted': '#94a3b8',
    '--home-hero-from': '#818cf8',
    '--home-hero-to': '#6366f1'
  } as React.CSSProperties,
  light: {
    '--home-bg': '#f8fafc',
    '--home-bg-alt': 'rgba(255,255,255,0.8)',
    '--home-bg-alt-rgb': '255, 255, 255',
    '--home-border': 'rgba(0,0,0,0.05)',
    '--home-border-card': 'rgba(0,0,0,0.05)',
    '--home-accent': '#4f46e5',
    '--home-accent-soft': 'rgba(79,70,229,0.05)',
    '--home-accent-text': '#4338ca',
    '--home-title': '#0f172a',
    '--home-muted': '#64748b',
    '--home-hero-from': '#4f46e5',
    '--home-hero-to': '#3730a3'
  } as React.CSSProperties
}

const GuideView = () => {
  const theme = useRecoilValue(themeStore)

  return (
    <div className={styles.root} style={THEME_TOKENS[theme]}>
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
          style={{
            marginTop: '8rem',
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'rgba(99, 102, 241, 0.05)',
            borderRadius: '3rem',
            border: '1px solid var(--home-border-card)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <h2 className={styles.stepTitle}>Despegue Inmediato Patrocinado</h2>
          <p className={styles.stepDesc} style={{ margin: '0 auto 3rem', maxWidth: '600px' }}>
            Gracias a nuestro sistema de <strong>Gas Sponsorship</strong>, tus primeros vuelos están libres de
            comisiones de red. Conecta tu Passkey y empieza hoy mismo.
          </p>
          <Link href='/missions'>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.2rem 3rem',
                background: 'linear-gradient(135deg, var(--home-hero-from), var(--home-hero-to))',
                color: 'white',
                borderRadius: '1.5rem',
                fontWeight: 800,
                fontSize: '1.4rem',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
              }}
            >
              INICIAR OPERACIONES <ArrowForwardIcon />
            </motion.span>
          </Link>
        </motion.section>
      </div>
    </div>
  )
}

export default GuideView
