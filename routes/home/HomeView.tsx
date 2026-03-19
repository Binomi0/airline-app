import Link from 'next/link'
import { useRecoilValue } from 'recoil'
import { themeStore } from 'store/theme.atom'
import styles from '../../styles/Home.module.css'

const NAV_ITEMS = [
  {
    link: '/hangar',
    emoji: '✈️',
    title: 'Hangar',
    desc: 'Compra y vende aeronaves NFT. Gestiona tu flota virtual.'
  },
  {
    link: '/license',
    emoji: '🪪',
    title: 'Licencias',
    desc: 'Obtén tu licencia de vuelo y empieza a volar hoy.'
  },
  {
    link: '/gas',
    emoji: '⛽',
    title: 'Gasolinera',
    desc: 'Haz staking de AIRL y gana AIRG para repostar tus aeronaves.'
  },
  {
    link: '/missions',
    emoji: '🗺️',
    title: 'Misiones',
    desc: 'Completa desafíos de vuelo dinámicos y gana recompensas.'
  },
  {
    link: '/ivao',
    emoji: '🌐',
    title: 'IVAO',
    desc: 'Monitoriza tus vuelos en IVAO y recibe recompensas en cadena.'
  }
]

const FEATURES = [
  {
    icon: '🔐',
    title: 'Propiedad Descentralizada',
    desc: 'Tus aeronaves son NFTs en Ethereum. Ninguna autoridad centralizada puede arrebatarte lo que es tuyo.'
  },
  {
    icon: '🔍',
    title: 'Operaciones Transparentes',
    desc: 'Cada vuelo, venta de ticket y transferencia de aeronave queda registrada en la blockchain de forma inmutable.'
  },
  {
    icon: '🏛️',
    title: 'Gobernanza Comunitaria',
    desc: 'La plataforma avanza según la voluntad de sus usuarios. Vota, propón y decide el futuro de WeiFly.'
  }
]

const STEPS = [
  {
    n: '01',
    title: 'Crea tu cuenta',
    desc: 'Regístrate con passkey. Sin contraseñas, sin complicaciones.'
  },
  {
    n: '02',
    title: 'Adquiere tu aeronave',
    desc: 'Compra un NFT de aeronave en el Hangar y obtén tu licencia de vuelo.'
  },
  {
    n: '03',
    title: 'Vuela y Gana',
    desc: 'Completa rutas en IVAO, gana tokens AIRL y crece dentro del ecosistema.'
  }
]

const STATS = [
  { value: 'NFT', label: 'Aeronaves tokenizadas' },
  { value: 'IVAO', label: 'Integración de vuelo real' },
  { value: 'AIRL', label: 'Token nativo del ecosistema' },
  { value: 'ETH', label: 'Blockchain Ethereum' }
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

  return (
    <div className={styles.root} style={THEME_TOKENS[theme]}>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <span />
          Simulación de vuelo virtual · Ethereum
        </div>

        <h1 className={styles.heroTitle}>WeiFly</h1>
        <p className={styles.heroSubtitle}>La Aerolínea Virtual Descentralizada</p>
        <p className={styles.heroDescription}>
          Vuela, posee aeronaves como NFTs, gana tokens y participa en la gobernanza de una aerolínea completamente
          transparente sobre blockchain.
        </p>

        <div className={styles.heroCtas}>
          <Link href='/hangar' className={styles.ctaPrimary}>
            Entrar al Hangar
          </Link>
          <Link href='/guide' className={styles.ctaSecondary}>
            Ver Guía
          </Link>
          <Link href='/whitepaper' className={styles.ctaSecondary}>
            Whitepaper
          </Link>
        </div>

        <div className={styles.scrollHint}>Explorar</div>
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
        <h2 className={styles.footerCtaTitle}>¿Listo para volar?</h2>
        <p className={styles.footerCtaDesc}>
          Lee el whitepaper, conecta tu wallet y únete a la primera aerolínea virtual descentralizada construida sobre
          Ethereum.
        </p>
        <div className={styles.heroCtas}>
          <Link href='/hangar' className={styles.ctaPrimary}>
            Empezar ahora
          </Link>
          <Link href='/whitepaper' className={styles.ctaSecondary}>
            Leer Whitepaper
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeView
