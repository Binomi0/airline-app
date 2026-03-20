import LinearProgress from '@mui/material/LinearProgress'

const WithLoading = ({ loading, children }: { loading: boolean; children: React.ReactNode }) => {
  return (
    <>
      {loading && <LinearProgress />}
      {children}
    </>
  )
}

export default WithLoading
