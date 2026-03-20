import React, { useEffect, useState } from 'react'
import styles from '../../../styles/Home.module.css'

interface ActiveFlight {
  _id: string
  userId: {
    vaUser?: {
      pilotId: string
    }
  }
  missionId: {
    origin: string
    destination: string
    aircraftId: string
    callsign: string
  }
  status: string
}

const LiveDashboard = () => {
  const [flights, setFlights] = useState<ActiveFlight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch('/api/stats/active-flights')
        if (res.ok) {
          const data = await res.json()
          setFlights(data)
        }
      } catch (error) {
        console.error('Error fetching live flights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
    const interval = setInterval(fetchFlights, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  if (loading && flights.length === 0) return null

  return (
    <section className={styles.liveDashboard}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Operaciones en Vivo</span>
        <h2 className={styles.sectionTitle}>Tráfico Real en el Ecosistema</h2>
        <p className={styles.sectionDesc}>
          Pilotos que están surcando los cielos en este mismo instante.
        </p>
      </div>

      <div className={styles.liveGrid}>
        {flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight._id} className={styles.liveCard}>
              <div className={styles.livePilot}>
                <span className={styles.pilotBadge}>
                  {flight.userId?.vaUser?.pilotId || 'Pilot'}
                </span>
                <span className={styles.liveAircraft}>{flight.missionId?.aircraftId}</span>
              </div>
              <div className={styles.liveRoute}>
                <span>{flight.missionId?.origin}</span>
                <span className={styles.routeArrow}>✈️</span>
                <span>{flight.missionId?.destination}</span>
              </div>
              <div className={styles.liveStatus}>
                <span className={styles.statusDot} />
                <span>{flight.status || 'En vuelo'} · {flight.missionId?.callsign}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>No hay vuelos activos en este momento. ¡Sé el primero en despegar!</div>
        )}
      </div>
    </section>
  )
}

export default LiveDashboard
