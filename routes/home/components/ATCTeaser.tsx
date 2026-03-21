import Link from 'next/link'
import styles from '../../../styles/Home.module.css'

const ATC_FEATURES = [
  {
    icon: '📡',
    title: 'Proof-of-Control',
    desc: 'Minería pasiva de $AIRL por cada piloto de WeiFly que cruce tu espacio aéreo activo en IVAO.'
  },
  {
    icon: '💸',
    title: 'Smart Tipping',
    desc: 'Recibe propinas sin comisiones directamente en tu Smart Account por dar un excelente servicio.'
  },
  {
    icon: '🛡️',
    title: 'Escudo de Aprendiz',
    desc: 'Un entorno libre de toxicidad. La reputación asimétrica te protege mientras aprendes a controlar.'
  }
]

const ATCTeaser = () => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Ecosistema Vivo</span>
        <h2 className={styles.sectionTitle}>Controladores Aéreos (ATC)</h2>
        <p className={styles.sectionDesc}>
          Únete a la primera aerolínea virtual que premia el esfuerzo de los Controladores. Tu radar ahora mina
          recompensas.
        </p>
      </div>

      <div className={styles.featuresGrid}>
        {ATC_FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className={styles.featureCard}>
            <div className={styles.featureIcon}>{icon}</div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>{desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
        <Link href='/atc' className={styles.ctaPrimary}>
          Descubre cómo funciona para ATCs
        </Link>
      </div>
    </div>
  )
}

export default ATCTeaser
