import React, { FC, useCallback, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import useAuth from 'hooks/useAuth'
import styles from 'styles/Launchpad.module.css'
import { CircularProgress } from '@mui/material'

const LaunchpadLanding: FC = () => {
  const user = useRecoilValue(userState)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { handleSignIn } = useAuth()

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await handleSignIn(email)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }, [email, handleSignIn])

  return (
    <div className={styles.root}>
      {/* ── Header ───────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>✈️</span> WeiFly
          </Link>
          <nav className={styles.navLinks}>
            <a href="#ecosistema" className={styles.navLink}>Ecosistema</a>
            <a href="#funciona" className={styles.navLink}>Cómo Funciona</a>
            <a href="#tokens" className={styles.navLink}>Tokens</a>
            <a href="#roadmap" className={styles.navLink}>Roadmap</a>
          </nav>
          <Link href={user ? "/home" : "/signin"} className={styles.navCta}>
            {user ? "Ir al Hangar" : "Acceder / Registrarse"}
          </Link>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image 
            src="/img/hero_bg.png" 
            alt="Futuristic jet flying over digital city" 
            fill
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>La primera aerolínea virtual descentralizada</div>
          <h1 className={styles.heroTitle}>Vuela, gana y gobierna los cielos.</h1>
          <p className={styles.heroSubtitle}>
            Conviértete en piloto. Obtén tu licencia NFT, gestiona tu flota y gana tokens AIRL completando vuelos reales en tu simulador favorito.
          </p>
          
           {!user ? (
            <form onSubmit={handleRegister} className={styles.registrationForm}>
              <div className={styles.heroActions}>
                <input 
                  type="email" 
                  placeholder="Tu email..." 
                  className={styles.emailInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className={styles.heroCtaPrimary} disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Comenzar a Volar"}
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.heroActions}>
              <Link href="/home" className={styles.heroCtaPrimary}>
                Entrar al Hangar
              </Link>
              <Link href="#ecosistema" className={styles.heroCtaSecondary}>
                Ver Ecosistema
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── El Problema ─────────────────────────────────────────── */}
      <section className={styles.problemSection}>
        <h2 className={styles.problemTitle}>El mundo de la simulación está cambiando.</h2>
        <div className={styles.problemQuote}>
          "Los simuladores de vuelo son increíbles, pero... vuelas solo, sin recompensas reales, sin progresión económica."
        </div>
        <div className={styles.solutionCard}>
          <p className={styles.sectionDesc}>
            <strong>Weifly soluciona esto.</strong> Añadimos una capa económica real con tokens, 
            progresión profesional mediante licencias NFT y una comunidad descentralizada que 
            gobierna el futuro de la aerolínea.
          </p>
        </div>
      </section>

      {/* ── Cómo Funciona ─────────────────────────────────────── */}
      <section id="funciona" className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Cómo Funciona</h2>
          <div className={styles.sectionDivider} />
        </div>
        
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Regístrate Seguro</h3>
            <p className={styles.stepDesc}>
              Solo con tu email. Creamos tu wallet automáticamente. La proteges con Passkey (biometría de tu dispositivo) sin contraseñas débiles.
            </p>
          </div>
          
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Consigue tu Licencia</h3>
            <p className={styles.stepDesc}>
              Compra o gana NFTs de licencias (Rangos 1 a 4). Desbloquea aeronaves icónicas desde una C172 hasta un B737.
            </p>
          </div>
          
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Vuela y Gana</h3>
            <p className={styles.stepDesc}>
              Conéctate con nuestra app Electron, vuela en MSFS o X-Plane. Al aterrizar, ganas tokens AIRL y un NFT de logro de tu ruta.
            </p>
          </div>
        </div>
      </section>

      {/* ── Tokens ─────────────────────────────────────────────── */}
      <section id="tokens" className={styles.tokensSection}>
        <div className={styles.tokensContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Economía Sostenible</h2>
            <p className={styles.sectionDesc}>Un ecosistema de dos tokens diseñado para el crecimiento y la utilidad real.</p>
          </div>
          
          <div className={styles.tokensGrid}>
            <div className={`${styles.tokenCard} ${styles.airlCard}`}>
              <div className={styles.tokenHeader}>
                <span className={styles.tokenSymbol}>AIRL</span>
                <span className={styles.tokenName}>Token de Gobierno</span>
              </div>
              <p>El núcleo del ecosistema WeiFly. Otorga poder de voto y acceso a beneficios exclusivos.</p>
              <div className={styles.tokenUsage}>
                <div className={styles.usageItem}>
                  <span className={styles.usageIcon}>✔</span>
                  <span>Gobernanza y votaciones</span>
                </div>
                <div className={styles.usageItem}>
                  <span className={styles.usageIcon}>✔</span>
                  <span>Staking para generar AIRG</span>
                </div>
                <div className={styles.usageItem}>
                  <span className={styles.usageIcon}>✔</span>
                  <span>Compra de licencias premium</span>
                </div>
              </div>
            </div>
            
            <div className={`${styles.tokenCard} ${styles.airgCard}`}>
              <div className={styles.tokenHeader}>
                <span className={styles.tokenSymbol}>AIRG</span>
                <span className={styles.tokenName}>Token de Combustible</span>
              </div>
              <p>El combustible necesario para operar tus vuelos. Se quema con cada milla recorrida.</p>
              <div className={styles.tokenUsage}>
                <div className={styles.usageItem}>
                  <span className={styles.usageIcon}>✔</span>
                  <span>Pago de tasas de vuelo</span>
                </div>
                <div className={styles.usageItem}>
                  <span className={styles.usageIcon}>✔</span>
                  <span>Mantenimiento de aeronaves</span>
                </div>
                <div className={styles.usageItem}>
                  <span className={styles.usageIcon}>✔</span>
                  <span>Exclusivo para stakers de AIRL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NFTs ───────────────────────────────────────────────── */}
      <section id="ecosistema" className={styles.nftsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Activos Digitales</h2>
          <p className={styles.sectionDesc}>Eres el dueño real de tus licencias y tu flota.</p>
        </div>
        
        <div className={styles.nftsGrid}>
          <div className={styles.nftCard}>
            <div className={styles.nftImageWrapper}>
              <Image src="/img/license/license4.jpg" alt="Licencia de Piloto" fill objectFit="cover" />
            </div>
            <div className={styles.nftInfo}>
              <div className={styles.nftTag}>Licencia</div>
              <h4 className={styles.nftTitle}>Rango 1-4</h4>
            </div>
          </div>
          
          <div className={styles.nftCard}>
            <div className={styles.nftImageWrapper}>
              <Image src="/img/aircrafts/C172.png" alt="Cessna 172" fill objectFit="cover" />
            </div>
            <div className={styles.nftInfo}>
              <div className={styles.nftTag}>Aeronave</div>
              <h4 className={styles.nftTitle}>Cessna 172 Skyhawk</h4>
            </div>
          </div>

          <div className={styles.nftCard}>
            <div className={styles.nftImageWrapper}>
              <Image src="/img/aircrafts/B737.png" alt="Boeing 737" fill objectFit="cover" />
            </div>
            <div className={styles.nftInfo}>
              <div className={styles.nftTag}>Aeronave</div>
              <h4 className={styles.nftTitle}>Boeing 737-800</h4>
            </div>
          </div>
          
          <div className={styles.nftCard}>
            <div className={styles.nftImageWrapper}>
              <Image src="/img/flight_log.png" alt="Flight Achievement" fill objectFit="cover" />
            </div>
            <div className={styles.nftInfo}>
              <div className={styles.nftTag}>Logro</div>
              <h4 className={styles.nftTitle}>Tarjeta de Vuelo</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roadmap ────────────────────────────────────────────── */}
      <section id="roadmap" className={styles.roadmapSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Roadmap</h2>
        </div>
        
        <div className={styles.roadmapContainer}>
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapPhase}>Fase 0 - Actual</div>
            <h3 className={styles.roadmapTitle}>Desarrollo y Testnet</h3>
            <p className={styles.roadmapContent}>Despliegue de contratos inteligentes y pruebas de estrés en la red.</p>
          </div>
          
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapPhase}>Fase 1</div>
            <h3 className={styles.roadmapTitle}>Fundación</h3>
            <p className={styles.roadmapContent}>Lanzamiento del registro email/passkey, venta privada (cap $100) y activación del staking.</p>
          </div>
          
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapPhase}>Fase 2</div>
            <h3 className={styles.roadmapTitle}>Hangar</h3>
            <p className={styles.roadmapContent}>Minting de licencias y aviones iniciales. Primeros vuelos monitorizados con la app Electron.</p>
          </div>

          <div className={styles.roadmapItem}>
            <div className={styles.roadmapPhase}>Fase 3</div>
            <h3 className={styles.roadmapTitle}>Público</h3>
            <p className={styles.roadmapContent}>Listado en Uniswap (AIRL), airdrop retroactivo para pilotos de prueba y apertura masiva.</p>
          </div>
        </div>
      </section>

      {/* ── Equipo / Partners ─────────────────────────────────────── */}
      <section className={styles.teamSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Equipo & Partners</h2>
          <p className={styles.sectionDesc}>Un equipo apasionado por la aviación y la tecnología blockchain.</p>
        </div>
        
        <div className={styles.teamGrid}>
          <div className={styles.teamMember}>
            <div className={styles.memberAvatar}>👨‍✈️</div>
            <h4 className={styles.memberTitle}>Capitanes de Weifly</h4>
            <p className={styles.memberDesc}>Próximamente: Partners de simuladores & Comunidades de pilotos.</p>
          </div>
        </div>

        <div className={styles.partnersGrid}>
           <div className={styles.partnerLogo}>Thirdweb</div>
           <div className={styles.partnerLogo}>Polygon</div>
           <div className={styles.partnerLogo}>MSFS</div>
           <div className={styles.partnerLogo}>X-Plane</div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logo}>✈️ WeiFly</Link>
            <p>La aerolínea virtual donde tú eres el dueño. Construida con seguridad Web3 y pasión por el vuelo.</p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Ecosistema</h4>
            <ul>
              <li><Link href="/hangar">Hangar</Link></li>
              <li><Link href="/license">Licencias</Link></li>
              <li><Link href="/gas">Combustible</Link></li>
            </ul>
          </div>
          <div className={styles.footerLinks}>
            <h4>Comunidad</h4>
            <ul>
              <li><a href="https://discord.gg/weifly">Discord</a></li>
              <li><a href="https://twitter.com/weifly">Twitter</a></li>
              <li><a href="https://github.com/weifly">Github</a></li>
            </ul>
          </div>
          <div className={styles.footerLinks}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/terms">Términos</Link></li>
              <li><Link href="/privacy">Privacidad</Link></li>
              <li><Link href="/whitepaper">Whitepaper</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>© 2026 WeiFly. Todos los derechos reservados.</p>
          <p>Construido sobre Thirdweb & Polygon</p>
        </div>
      </footer>
    </div>
  )
}

export default LaunchpadLanding
