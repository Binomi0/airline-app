import { useQuery } from '@tanstack/react-query'
import { fetcher } from 'utils'
import styles from 'styles/Home.module.css'

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
  const { data: flights, isLoading } = useQuery<ActiveFlight[]>({
    queryKey: ['/api/stats/active-flights'],
    queryFn: () => fetcher('/api/stats/active-flights'),
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  })

  if (isLoading || !flights || flights.length === 0) return null

  return (
    <section className={styles.liveDashboard}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>Operaciones en Vivo</span>
        <h2 className={styles.sectionTitle}>Tráfico Real en el Ecosistema</h2>
        <p className={styles.sectionDesc}>Pilotos que están surcando los cielos en este mismo instante.</p>
      </div>

      <div className={styles.liveGrid}>
        {flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight._id} className={styles.liveCard}>
              <div className={styles.livePilot}>
                <span className={styles.pilotBadge}>{flight.userId?.vaUser?.pilotId || 'Pilot'}</span>
                <span className={styles.liveAircraft}>{flight.missionId?.aircraftId}</span>
              </div>
              <div className={styles.liveRoute}>
                <span>{flight.missionId?.origin}</span>
                <span className={styles.routeArrow}>✈️</span>
                <span>{flight.missionId?.destination}</span>
              </div>
              <div className={styles.liveStatus}>
                <span className={styles.statusDot} />
                <span>
                  {flight.status || 'En vuelo'} · {flight.missionId?.callsign}
                </span>
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
