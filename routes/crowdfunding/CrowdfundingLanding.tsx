import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  FlightTakeoff,
  AccountBalanceWallet,
  Flight,
  ChevronRight,
  TrendingUp,
  Timer,
  Verified,
  Groups
} from '@mui/icons-material'
import { Box, Container, Grid, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import styles from 'styles/Crowdfunding.module.css'
import { useActiveAccount } from 'thirdweb/react'

const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')

type Particles = {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

const DynamicParticles = () => {
  const [particles, setParticles] = useState<Particles[]>([])

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 15 }).map(
      (_, i) =>
        ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 10 + 10,
          delay: Math.random() * 5
        }) as Particles
    )
    setParticles(newParticles)
  }, [])

  return (
    <div className={styles.particlesContainer}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={styles.particle}
          initial={{ left: '-10%', opacity: 0 }}
          animate={{
            left: '110%',
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
          style={{
            top: `${p.y}%`,
            width: `${p.size * 20}px`,
            height: '2px'
          }}
        />
      ))}
    </div>
  )
}

const CrowdfundingLanding = () => {
  const activeAccount = useActiveAccount()
  const [raised] = useState(156750)
  const goal = 500000
  const [daysRemaining] = useState(30)
  const [investorCount] = useState(1234)
  const [investmentAmount, setInvestmentAmount] = useState(1000)

  // Tokenomics data
  const distribution = [
    { label: 'Crowdfunding público', value: 40, color: '#2A7DE1' },
    { label: 'Reserva ecosistema', value: 20, color: '#FF6B35' },
    { label: 'Equipo (vesting)', value: 15, color: '#60A5FA' },
    { label: 'Liquidez Uniswap', value: 10, color: '#34D399' },
    { label: 'Marketing/Partners', value: 10, color: '#A78BFA' },
    { label: 'Airdrops comunidad', value: 5, color: '#F472B6' }
  ]

  return (
    <div className={styles.root}>
      {/* 1. NAVBAR (Sticky) */}
      <header className={styles.header}>
        <div className={styles.navContent}>
          <Link href='/' className={styles.logo}>
            <div className={styles.logoIcon}>
              <Flight sx={{ transform: 'rotate(45deg)' }} />
              <div className={styles.logoTrail} />
            </div>
            Weifly <span style={{ color: 'var(--cf-secondary)', marginLeft: '4px' }}>2.0</span>
          </Link>

          <nav className={styles.navList}>
            <a href='#problema' className={styles.navLink}>
              Problema
            </a>
            <a href='#solucion' className={styles.navLink}>
              Solución
            </a>
            <a href='#tokenomics' className={styles.navLink}>
              Tokenomics
            </a>
            <a href='#roadmap' className={styles.navLink}>
              Roadmap
            </a>
            <a href='#equipo' className={styles.navLink}>
              Equipo
            </a>
          </nav>

          <div className={styles.navActions}>
            <Link href='#inversion' className={styles.btnInvertir}>
              Invertir Ahora
            </Link>
            <button className={styles.btnConnect}>
              <AccountBalanceWallet sx={{ mr: 1, fontSize: 18 }} />
              {activeAccount ? maskAddress(activeAccount.address) : 'Conectar'}
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src='/img/hero_3d_plane.png'
            alt='Hero Background'
            fill
            style={{ objectFit: 'cover', opacity: 0.4 }}
            priority
          />
          <div className={styles.particles}>
            <DynamicParticles />
          </div>
        </div>

        <Container className={styles.heroContent}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant='h1' className={`${styles.title} ${styles.heroTitle}`}>
              La primera aerolínea virtual descentralizada del mundo
            </Typography>
            <Typography className={styles.heroSubtitle}>
              Tokeniza la aviación. Gana volando. Sé parte del futuro de la simulación aérea.
            </Typography>
          </motion.div>

          {/* Crowdfunding Metrics */}
          <motion.div
            className={styles.heroMetrics}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Meta de financiación</span>
              <span className={styles.metricValue}>
                $500,000 <small style={{ fontSize: '0.4em' }}>USDC</small>
              </span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Recaudado</span>
              <span className={styles.metricValue}>${raised.toLocaleString()}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Inversores</span>
              <span className={styles.metricValue}>{investorCount.toLocaleString()}+</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Días restantes</span>
              <span className={styles.metricValue}>{daysRemaining}</span>
            </div>

            <div className={styles.progressWrapper}>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(raised / goal) * 100}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--cf-text-muted)'
                }}
              >
                <span>{((raised / goal) * 100).toFixed(1)}% completado</span>
                <span>Objetivo: $500k</span>
              </div>
            </div>
          </motion.div>

          <div className={styles.heroBtnGroup}>
            <Link href='#inversion' className={styles.btnPrimary}>
              Comprar Tokens AIRL
            </Link>
            <Link href='/whitepaper' className={styles.btnSecondary}>
              Ver Whitepaper
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. SECCIÓN "EL PROBLEMA" */}
      <section id='problema' className={styles.section}>
        <div className={styles.splitScreen}>
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Typography
              variant='h2'
              className={`${styles.title} ${styles.sectionTitle}`}
              style={{ textAlign: 'left', marginBottom: '40px' }}
            >
              La simulación aérea está rota
            </Typography>
            <ul className={styles.problemList}>
              <li className={styles.problemItem}>
                <div className={styles.problemIcon}>
                  <TrendingUp />
                </div>
                <div className={styles.problemText}>
                  <h3>Economías cerradas</h3>
                  <p>Inviertes miles de horas y dólares en software que no te devuelve valor real.</p>
                </div>
              </li>
              <li className={styles.problemItem}>
                <div className={styles.problemIcon}>
                  <Groups />
                </div>
                <div className={styles.problemText}>
                  <h3>Sin gobernanza</h3>
                  <p>Las redes de vuelo actuales son controladas por entes centralizados sin voz para el usuario.</p>
                </div>
              </li>
              <li className={styles.problemItem}>
                <div className={styles.problemIcon}>
                  <Verified />
                </div>
                <div className={styles.problemText}>
                  <h3>Logros efímeros</h3>
                  <p>Tus medallas y horas de vuelo no te pertenecen, son solo entradas en una base de datos ajena.</p>
                </div>
              </li>
              <li className={styles.problemItem}>
                <div className={styles.problemIcon}>
                  <Timer />
                </div>
                <div className={styles.problemText}>
                  <h3>Incentivos nulos</h3>
                  <p>No existe una motivación económica para realizar operaciones de vuelo precisas y profesionales.</p>
                </div>
              </li>
            </ul>
          </motion.div>
          <motion.div
            className={styles.problemImage}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Image src='/img/sim_comparison.png' alt='Problem Comparison' fill style={{ objectFit: 'cover' }} />
          </motion.div>
        </div>
      </section>

      {/* 4. SECCIÓN "LA SOLUCIÓN" */}
      <section id='solucion' className={styles.section} style={{ background: 'rgba(10, 30, 60, 0.4)' }}>
        <Typography variant='h2' className={`${styles.title} ${styles.sectionTitle}`}>
          Weifly 2.0: Donde volar paga
        </Typography>
        <div className={styles.solutionGrid}>
          {[
            { icon: '🛩️', title: 'Licencias NFT', desc: 'Progresión real con valor de mercado secundario.' },
            { icon: '⛽', title: 'Token AIRG', desc: 'Combustible que se genera haciendo staking de AIRL.' },
            { icon: '💰', title: 'Recompensas AIRL', desc: 'Gana tokens por cada milla volada con precisión.' },
            { icon: '🔐', title: 'Wallet Passkey', desc: 'Seguridad de grado bancario sin frases semilla.' },
            { icon: '🛰️', title: 'Verificación ML', desc: 'IA que audita tus vuelos para evitar fraudes.' },
            { icon: '🎮', title: 'Multi-simulador', desc: 'Compatible con MSFS, X-Plane y Prepar3D.' }
          ].map((item, i) => (
            <motion.div
              key={i}
              className={styles.solutionCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={styles.solutionIcon}>{item.icon}</div>
              <h3 className={styles.title}>{item.title}</h3>
              <p style={{ color: 'var(--cf-text-muted)', marginTop: '12px' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. SECCIÓN "TOKENOMICS" */}
      <section id='tokenomics' className={styles.section}>
        <div className={styles.tokenomicsLayout}>
          <div className={styles.chartPlaceholder}>
            {/* Abstract SVG Chart */}
            <svg width='400' height='400' viewBox='0 0 400 400'>
              <circle cx='200' cy='200' r='150' fill='none' stroke='rgba(255,255,255,0.05)' strokeWidth='60' />
              {distribution.map((d, i) => {
                const total = distribution.slice(0, i).reduce((acc, curr) => acc + curr.value, 0)
                return (
                  <motion.circle
                    key={i}
                    cx='200'
                    cy='200'
                    r='150'
                    fill='none'
                    stroke={d.color}
                    strokeWidth='60'
                    strokeDasharray={`${d.value * 9.42} 942`}
                    strokeDashoffset={-total * 9.42}
                    initial={{ strokeDasharray: '0 942' }}
                    whileInView={{ strokeDasharray: `${d.value * 9.42} 942` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                )
              })}
              <text x='200' y='190' textAnchor='middle' fill='#fff' fontSize='24' fontWeight='800'>
                AIRL
              </text>
              <text x='200' y='220' textAnchor='middle' fill='var(--cf-text-muted)' fontSize='14'>
                Total Supply
              </text>
            </svg>
            <div
              style={{
                position: 'absolute',
                bottom: -20,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center'
              }}
            >
              {distribution.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ width: '12px', height: '12px', background: d.color, borderRadius: '2px' }} />
                  <span>
                    {d.label} ({d.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Typography variant='h2' className={`${styles.title} ${styles.sectionTitle}`} style={{ textAlign: 'left' }}>
              Economía del vuelo
            </Typography>
            <div className={styles.tokenUses}>
              {[
                { title: 'Gobernanza DAO', desc: 'Vota cambios en rutas y flota.' },
                { title: 'Staking AIRL', desc: 'Produce AIRG para volar.' },
                { title: 'Aeronaves NFT', desc: 'Compra modelos exclusivos.' },
                { title: 'Eventos', desc: 'Acceso a tours mundiales.' }
              ].map((use, i) => (
                <div key={i} className={styles.useItem}>
                  <Verified sx={{ color: 'var(--cf-secondary)' }} />
                  <div>
                    <h4 className={styles.title}>{use.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--cf-text-muted)' }}>{use.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculadora de Retorno */}
            <Box
              mt={6}
              p={4}
              sx={{
                borderRadius: '24px',
                background: 'rgba(42, 125, 225, 0.1)',
                border: '1px solid var(--cf-secondary)'
              }}
            >
              <Typography variant='h6' className={styles.title} mb={2}>
                Calculadora de Staking
              </Typography>
              <Grid container spacing={3} alignItems='center'>
                <Grid item xs={12} sm={8}>
                  <Typography variant='body2' color='var(--cf-text-muted)' mb={1}>
                    Cantidad de AIRL a stakear
                  </Typography>
                  <input
                    type='range'
                    min='100'
                    max='10000'
                    step='100'
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--cf-secondary)' }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant='h5' align='right' className={styles.mono}>
                    {investmentAmount} <small>AIRL</small>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      pt: 2,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' color='var(--cf-text-muted)'>
                      Ganancia diaria estimada:
                    </Typography>
                    <Typography variant='h6' color='#34D399' className={styles.mono}>
                      +{(investmentAmount * 0.05).toFixed(2)} AIRG
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN "ROADMAP" */}
      <section id='roadmap' className={styles.section}>
        <Typography variant='h2' className={`${styles.title} ${styles.sectionTitle}`}>
          Nuestro plan de vuelo
        </Typography>
        <div className={styles.roadmap}>
          {[
            {
              phase: 'FASE 1 - Q2 2024',
              title: 'Lanzamiento crowdfunding',
              items: ['App de autenticación con passkeys', 'Token AIRL en Uniswap', 'Dashboard de inversores']
            },
            {
              phase: 'FASE 2 - Q3 2024',
              title: 'Primeros vuelos verificados',
              items: ['Staking AIRL → AIRG', 'NFTs de licencias y aviones', 'Integración MSFS SDK']
            },
            {
              phase: 'FASE 3 - Q4 2024',
              title: 'Ecosistema Maduro',
              items: ['Sistema ML anti-bots', 'Integración múltiples simuladores', 'Competiciones mundiales']
            },
            {
              phase: 'FASE 4 - 2025',
              title: 'Expansión Global',
              items: ['Lanzamiento DAO', 'Partnerships aerolíneas reales', 'App móvil nativa']
            }
          ].map((step, i) => (
            <motion.div
              key={i}
              className={styles.roadmapItem}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.roadmapPhase}>{step.phase}</div>
              <div className={styles.roadmapBox}>
                <h4 className={styles.title}>{step.title}</h4>
                <ul className={styles.roadmapList}>
                  {step.items.map((item, j) => (
                    <li key={j}>
                      <Verified sx={{ fontSize: 16, color: 'var(--cf-secondary)' }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. SECCIÓN "INVERSIÓN" (Tiers) */}
      <section id='inversion' className={styles.section} style={{ background: 'rgba(255, 107, 53, 0.05)' }}>
        <Typography variant='h2' className={`${styles.title} ${styles.sectionTitle}`}>
          Elige tu nivel de participación
        </Typography>
        <div className={styles.tiers}>
          {/* Tier 1 */}
          <div className={styles.tierCard}>
            <span className={styles.tierName}>CADETE</span>
            <span className={styles.tierPrice}>$100</span>
            <ul className={styles.tierList}>
              <li>
                <ChevronRight /> Tokens AIRL a precio seed
              </li>
              <li>
                <ChevronRight /> Acceso Discord comunidad
              </li>
              <li>
                <ChevronRight /> NFT de bienvenida
              </li>
            </ul>
            <Button variant='outlined' color='inherit' fullWidth sx={{ borderRadius: '12px', py: 2 }}>
              Seleccionar
            </Button>
          </div>

          {/* Tier 2 */}
          <div className={`${styles.tierCard} ${styles.featured}`}>
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'var(--cf-accent)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.7rem'
              }}
            >
              POPULAR
            </div>
            <span className={styles.tierName}>PILOTO</span>
            <span className={styles.tierPrice}>$1,000</span>
            <ul className={styles.tierList}>
              <li>
                <Verified sx={{ color: '#34D399', fontSize: 18 }} /> Todo de Cadete
              </li>
              <li>
                <Verified sx={{ color: '#34D399', fontSize: 18 }} /> Licencia NFT Nivel 1 (C172)
              </li>
              <li>
                <Verified sx={{ color: '#34D399', fontSize: 18 }} /> 5% bonus tokens
              </li>
              <li>
                <Verified sx={{ color: '#34D399', fontSize: 18 }} /> Acceso Early Beta
              </li>
            </ul>
            <Button
              variant='contained'
              sx={{ background: 'var(--cf-accent)', color: '#fff', borderRadius: '12px', py: 2 }}
            >
              Invertir Ahora
            </Button>
          </div>

          {/* Tier 3 */}
          <div className={styles.tierCard}>
            <span className={styles.tierName}>CAPITÁN</span>
            <span className={styles.tierPrice}>$5,000</span>
            <ul className={styles.tierList}>
              <li>
                <Verified sx={{ color: 'var(--cf-secondary)', fontSize: 18 }} /> Todo de Piloto
              </li>
              <li>
                <Verified sx={{ color: 'var(--cf-secondary)', fontSize: 18 }} /> Aeronave C700 NFT
              </li>
              <li>
                <Verified sx={{ color: 'var(--cf-secondary)', fontSize: 18 }} /> 10% bonus tokens
              </li>
              <li>
                <Verified sx={{ color: 'var(--cf-secondary)', fontSize: 18 }} /> Votación prioritaria
              </li>
            </ul>
            <Button variant='outlined' color='secondary' fullWidth sx={{ borderRadius: '12px', py: 2 }}>
              Seleccionar
            </Button>
          </div>
        </div>
      </section>

      {/* 8. SECCIÓN "EQUIPO" */}
      <section id='equipo' className={styles.section}>
        <Typography variant='h2' className={`${styles.title} ${styles.sectionTitle}`}>
          Quiénes hacen esto posible
        </Typography>
        <Grid container spacing={4} justifyContent='center'>
          {[
            { name: 'Alex Rivera', role: 'CEO / Ex-Piloto', icon: '👨‍✈️' },
            { name: 'Elena Chen', role: 'CTO / Smart Contracts', icon: '💻' },
            { name: 'Marc Vales', role: 'Head of Sim / MSFS Dev', icon: '🚁' },
            { name: 'Satoshi Aviator', role: 'Strategic Advisor', icon: '🕵️' }
          ].map((member, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Box
                textAlign='center'
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  background: 'var(--cf-glass-bg)',
                  border: '1px solid var(--cf-glass-border)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{member.icon}</div>
                <Typography variant='h6' className={styles.title}>
                  {member.name}
                </Typography>
                <Typography variant='body2' color='var(--cf-text-muted)'>
                  {member.role}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </section>

      {/* 9. SECCIÓN "FAQ" */}
      <section className={styles.section}>
        <Typography variant='h2' className={`${styles.title} ${styles.sectionTitle}`}>
          Preguntas frecuentes
        </Typography>
        <div className={styles.faqGrid}>
          {[
            {
              q: '¿Cómo sé que no es un scam?',
              a: 'Todos nuestros contratos están auditados por ConsenSys Diligence y son de código abierto en GitHub. La liquidez estará bloqueada por 2 años.'
            },
            {
              q: '¿Qué simuladores están soportados?',
              a: 'Actualmente soportamos Microsoft Flight Simulator (2020/2024), X-Plane 11/12 y Prepar3D v5/v6.'
            },
            {
              q: '¿Necesito hardware especial?',
              a: 'No, cualquier PC capaz de correr los simuladores mencionados es suficiente. Nuestra app de tracking consume recursos mínimos.'
            },
            {
              q: '¿Cómo se verifican los vuelos?',
              a: 'Usamos un oráculo personalizado que lee los datos de telemetría del simulador y los cruza con datos de tráfico real e IA para asegurar que el vuelo fue operado manualmente.'
            }
          ].map((faq, i) => (
            <Accordion
              key={i}
              sx={{
                background: 'var(--cf-glass-bg)',
                color: '#fff',
                border: '1px solid var(--cf-glass-border)',
                mb: 2,
                borderRadius: '16px !important',
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
                <Typography fontWeight={700}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color='var(--cf-text-muted)'>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className={styles.footer}>
        <Container>
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <div className={styles.logo} style={{ marginBottom: '24px' }}>
                ✈️ Weifly <span style={{ color: 'var(--cf-accent)' }}>DAO</span>
              </div>
              <Typography color='var(--cf-text-muted)'>
                Liderando la revolución de la aviación virtual mediante la propiedad real y la gobernanza comunitaria.
              </Typography>
              <Box mt={4} display='flex' gap={2}>
                <Button size='small' variant='outlined' color='inherit'>
                  Twitter
                </Button>
                <Button size='small' variant='outlined' color='inherit'>
                  Discord
                </Button>
                <Button size='small' variant='outlined' color='inherit'>
                  Github
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography fontWeight={800} mb={3}>
                Plataforma
              </Typography>
              <ul style={{ listStyle: 'none', padding: 0, color: 'var(--cf-text-muted)', lineHeight: '2.5' }}>
                <li>Hangar</li>
                <li>Tokens</li>
                <li>Vuelos</li>
              </ul>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography fontWeight={800} mb={3}>
                Recursos
              </Typography>
              <ul style={{ listStyle: 'none', padding: 0, color: 'var(--cf-text-muted)', lineHeight: '2.5' }}>
                <li>Whitepaper</li>
                <li>Auditoría</li>
                <li>Guía</li>
              </ul>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={800} mb={3}>
                Boletín de Vuelo
              </Typography>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type='email'
                  placeholder='Email...'
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--cf-glass-border)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff'
                  }}
                />
                <Button variant='contained' sx={{ background: 'var(--cf-accent)' }}>
                  Suscribir
                </Button>
              </div>
            </Grid>
          </Grid>
          <Box
            mt={10}
            pt={4}
            sx={{
              borderTop: '1px solid var(--cf-glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              color: 'var(--cf-text-muted)',
              fontSize: '0.8rem'
            }}
          >
            <span>© 2026 Weifly Aerolínea Virtual Descentralizada</span>
            <span>Powered by Thirdweb & Base</span>
          </Box>
        </Container>

        <Link href='#inversion' className={styles.volarBtn}>
          <FlightTakeoff sx={{ mr: 1 }} /> ¡Volar Ahora!
        </Link>
      </footer>
    </div>
  )
}

export default CrowdfundingLanding
