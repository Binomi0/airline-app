import dynamic from 'next/dynamic'

const GuideView = dynamic(() => import('routes/guide/GuideView'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100vh',
        background: '#0b0f19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}
    >
      Loading Guide...
    </div>
  )
})

const Guide = () => <GuideView />

export default Guide
