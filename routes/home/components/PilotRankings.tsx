import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Home.module.css'

interface RankingItem {
  _id: string
  pilotId: string
  value: number
}

interface Rankings {
  effective: RankingItem[]
  traveled: RankingItem[]
  fastest: RankingItem[]
  topScorers: RankingItem[]
}

const PilotRankings = () => {
  const [rankings, setRankings] = useState<Rankings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch('/api/stats/rankings')
        if (res.ok) {
          const data = await res.json()
          setRankings(data)
        }
      } catch (error) {
        console.error('Error fetching rankings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [])

  if (loading || !rankings) return null

  return (
    <section className={styles.rankings}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Salón de la Fama</span>
        <h2 className={styles.sectionTitle}>Nuestros Pilotos de Élite</h2>
        <p className={styles.sectionDesc}>
          Reconocimiento a los aviadores más destacados de la red WeiFly.
        </p>
      </div>

      <div className={styles.rankingsGrid}>
        <RankingColumn title="Más Efectivos" items={rankings.effective} unit="AIRL" />
        <RankingColumn title="Más Viajeros" items={rankings.traveled} unit="nm" />
        <RankingColumn title="Más Rápidos" items={rankings.fastest} unit="kts" decimals={1} />
        <RankingColumn title="Puntuación Top" items={rankings.topScorers} unit="pts" decimals={1} />
      </div>
    </section>
  )
}

const RankingColumn = ({
  title,
  items,
  unit,
  decimals = 0
}: {
  title: string
  items: RankingItem[]
  unit: string
  decimals?: number
}) => (
  <div className={styles.rankingColumn}>
    <h3 className={styles.rankingTitle}>{title}</h3>
    <div className={styles.rankingList}>
      {items.map((item, index) => (
        <div key={item._id} className={styles.rankItem}>
          <span className={styles.rankPos}>{String(index + 1).padStart(2, '0')}</span>
          <span className={styles.rankName}>{item.pilotId}</span>
          <span className={styles.rankValue}>
            {item.value.toFixed(decimals)} {unit}
          </span>
        </div>
      ))}
      {items.length === 0 && <div className={styles.emptyState}>No hay datos aún</div>}
    </div>
  </div>
)

export default PilotRankings
