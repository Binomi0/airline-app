import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import styles from 'styles/Home.module.css'
import LiveDashboard from './components/LiveDashboard'
import PilotRankings from './components/PilotRankings'
import { useTheme, alpha } from '@mui/material/styles'
import { useMemo } from 'react'

const NAV_ITEMS = [
  {
    link: '/hangar',
    emoji: '✈️',
    title: 'Hangar',
    desc: 'Compra y vende aeronaves. Gestiona tu flota virtual en la red Arbitrum.'
  },
  {
    link: '/license',
    emoji: '🪪',
    title: 'Licencias',
    desc: 'Certifícate para volar. Selecciona la licencia adecuada para tu aeronave.'
  },
  {
    link: '/gas',
    emoji: '⛽',
    title: 'Gasolinera',
    desc: 'Genera combustible. Haz staking de AIRL para obtener AIRG y repostar.'
  },
  {
    link: '/missions',
    emoji: '🗺️',
    title: 'Misiones',
    desc: 'Vuelos dinámicos. Encuentra misiones basadas en rutas aéreas optimizadas.'
  },
  {
    link: '/ivao',
    emoji: '🌐',
    title: 'Red de Vuelo',
    desc: 'Sincronización total. Valida tus vuelos en tiempo real y recibe tus recompensas.'
  },
  {
    link: '/stats',
    emoji: '📊',
    title: 'Estadísticas',
    desc: 'WeiFly Analytics. Consulta misiones completadas, récords y el salón de la fama.'
  }
]

const FEATURES = [
  {
    icon: '🔐',
    title: 'Cuentas Inteligentes',
    desc: 'Acceso seguro con Passkeys. Tu identidad y activos protegidos por Smart Accounts de Thirdweb.'
  },
  {
    icon: '⚡',
    title: 'Eficiencia Layer 2',
    desc: 'Transacciones casi instantáneas y sin apenas comisiones gracias a la red Arbitrum.'
  },
  {
    icon: '⛽',
    title: 'Economía Circular',
    desc: 'Un ecosistema sostenible donde el staking de AIRL alimenta tus misiones de vuelo diarias.'
  }
]

const STEPS = [
  {
    n: '01',
    title: 'Crea tu cuenta',
    desc: 'Registro rápido con Passkey. Sin contraseñas, máxima seguridad y facilidad.'
  },
  {
    n: '02',
    title: 'Prepara tu flota',
    desc: 'Adquiere tu aeronave y la licencia correspondiente para empezar a operar.'
  },
  {
    n: '03',
    title: 'Vuela y Progresa',
    desc: 'Completa misiones, gestiona tu combustible y destaca como piloto en la red de vuelo.'
  }
]

const STATS = [
  { value: 'NFT', label: 'Aeronaves Únicas' },
  { value: 'En Vivo', label: 'Tráfico en Real' },
  { value: 'AIRL', label: 'Utility Token' },
  { value: 'L2', label: 'Red Arbitrum' }
]

const HomeView = () => {
  const user = useRecoilValue(userState)
  const theme = useTheme()

  const dynamicTokens = useMemo(
    () =>
      ({
        '--home-bg': theme.palette.background.default,
        '--home-bg-alt':
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.6)
            : alpha(theme.palette.background.paper, 0.65),
        '--home-border': alpha(theme.palette.divider, 0.07),
        '--home-border-card': alpha(theme.palette.divider, 0.08),
        '--home-accent': theme.palette.primary.main,
        '--home-accent-soft': alpha(theme.palette.primary.main, 0.12),
        '--home-accent-text': theme.palette.primary.light,
        '--home-title': theme.palette.text.primary,
        '--home-muted': alpha(theme.palette.text.secondary, 0.85),
        '--home-muted-label': alpha(theme.palette.text.secondary, 0.7),
        '--home-hero-from': theme.palette.weifly.home.hero.from,
        '--home-hero-mid': theme.palette.weifly.home.hero.mid,
        '--home-hero-to': theme.palette.weifly.home.hero.to
      }) as React.CSSProperties,
    [theme]
  )

  return (
    <div className={styles.root} style={dynamicTokens}>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span />
          Operaciones Aéreas Descentralizadas · Layer 2
        </div>

        <h1 className={styles.heroTitle}>WeiFly</h1>
        <p className={styles.heroSubtitle}>La Aerolínea Virtual Evolucionada</p>
        <p className={styles.heroDescription}>
          WeiFly es la evolución de las aerolíneas virtuales. Posee activos reales, gestiona tu combustible mediante
          staking y vuela misiones sincronizadas con rutas aéreas en tiempo real.
        </p>

        <div className={styles.heroCtas}>
          <Link href='/hangar' className={styles.ctaPrimary}>
            Explorar Hangar
          </Link>
          <Link href='/guide' className={styles.ctaSecondary}>
            Cómo Empezar
          </Link>
          <Link href='/license' className={styles.ctaSecondary}>
            Obtener Licencia
          </Link>
        </div>

        <div className={styles.scrollHint}>Saber más</div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <div className={styles.stats}>
        {STATS.map(({ value, label }) => (
          <div key={label} className={styles.statItem}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {user && <LiveDashboard />}

      {/* ── Features ───────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Por qué WeiFly</span>
          <h2 className={styles.sectionTitle}>Blockchain al servicio del piloto</h2>
          <p className={styles.sectionDesc}>
            WeiFly combina la pasión por la simulación de vuelo con la seguridad y transparencia de Ethereum,
            devolviendo el control al piloto.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{icon}</div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      {/* ── Steps ──────────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Cómo funciona</span>
          <h2 className={styles.sectionTitle}>Tres pasos para despegar</h2>
          <Link
            href='/guide'
            style={{ color: 'var(--home-accent)', fontWeight: 600, marginTop: '1rem', display: 'inline-block' }}
          >
            Ver guía paso a paso →
          </Link>
        </div>
        <div className={styles.stepsGrid}>
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className={styles.stepItem}>
              <div className={styles.stepNumber}>{n}</div>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {user && <PilotRankings />}

      <div className={styles.divider} />

      <div className={styles.divider} />

      {/* ── Nav Cards ──────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Plataforma</span>
          <h2 className={styles.sectionTitle}>Explora WeiFly</h2>
          <p className={styles.sectionDesc}>Todo lo que necesitas para volar, crecer y ganar en un solo lugar.</p>
        </div>
        <div className={styles.navGrid}>
          {NAV_ITEMS.map(({ link, emoji, title, desc }) => (
            <Link key={link} href={link} className={styles.navCard}>
              <span className={styles.navCardEmoji}>{emoji}</span>
              <span className={styles.navCardTitle}>{title}</span>
              <p className={styles.navCardDesc}>{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer CTA ─────────────────────────────────────────── */}
      <div className={styles.divider} />
      <div className={styles.footerCta}>
        <h2 className={styles.footerCtaTitle}>¿Listo para tu primer vuelo?</h2>
        <p className={styles.footerCtaDesc}>
          Únete a la aerolínea virtual que utiliza Smart Accounts y Passkeys para una experiencia Web3 sin fricción.
          Conecta tu wallet y empieza a volar hoy mismo.
        </p>
        <div className={styles.heroCtas}>
          <Link href='/hangar' className={styles.ctaPrimary}>
            Acceder al Hangar
          </Link>
          <Link href='/guide' className={styles.ctaSecondary}>
            Ver Guía de Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeView
