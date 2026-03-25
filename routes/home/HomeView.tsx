import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'
import { userState } from 'store/user.atom'
import styles from '../../styles/Home.module.css'
import LiveDashboard from './components/LiveDashboard'
import PilotRankings from './components/PilotRankings'

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
    desc: 'Vuelos dinámicos. Encuentra misiones basadas en el tráfico aéreo real de IVAO.'
  },
  {
    link: '/ivao',
    emoji: '🌐',
    title: 'IVAO',
    desc: 'Sincronización total. Valida tus vuelos en tiempo real y recibe tus recompensas.'
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
    desc: 'Completa misiones, gestiona tu combustible y destaca como piloto en IVAO.'
  }
]

const STATS = [
  { value: 'NFT', label: 'Aeronaves Únicas' },
  { value: 'IVAO', label: 'Tráfico en Real' },
  { value: 'AIRL', label: 'Utility Token' },
  { value: 'L2', label: 'Red Arbitrum' }
]

/** Tokens que cambian entre dark y light mode */
const THEME_TOKENS: Record<'dark' | 'light', React.CSSProperties> = {
  dark: {
    '--home-bg': '#0b0f19',
    '--home-bg-alt': 'rgba(15,18,28,0.6)',
    '--home-border': 'rgba(255,255,255,0.06)',
    '--home-border-card': 'rgba(255,255,255,0.07)',
    '--home-accent': '#6366f1',
    '--home-accent-soft': 'rgba(99,102,241,0.12)',
    '--home-accent-text': '#a5b4fc',
    '--home-title': '#e2e8f0',
    '--home-muted': 'rgba(148,163,184,0.85)',
    '--home-muted-label': 'rgba(148,163,184,0.7)',
    '--home-hero-from': '#e0e7ff',
    '--home-hero-mid': '#a5b4fc',
    '--home-hero-to': '#818cf8'
  } as React.CSSProperties,
  light: {
    '--home-bg': '#f3f4f6',
    '--home-bg-alt': 'rgba(255,255,255,0.65)',
    '--home-border': 'rgba(0,0,0,0.07)',
    '--home-border-card': 'rgba(0,0,0,0.08)',
    '--home-accent': '#4f46e5',
    '--home-accent-soft': 'rgba(79,70,229,0.09)',
    '--home-accent-text': '#4f46e5',
    '--home-title': '#111827',
    '--home-muted': 'rgba(55,65,81,0.85)',
    '--home-muted-label': 'rgba(55,65,81,0.65)',
    '--home-hero-from': '#312e81',
    '--home-hero-mid': '#4f46e5',
    '--home-hero-to': '#6366f1'
  } as React.CSSProperties
}

const HomeView = () => {
  const theme = useRecoilValue(themeStore)
  const user = useRecoilValue(userState)

  return (
    <div className={styles.root} style={THEME_TOKENS[theme]}>
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
          staking y vuela misiones sincronizadas con el tráfico real de IVAO.
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
