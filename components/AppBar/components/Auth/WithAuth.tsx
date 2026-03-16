import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AirBalanceBar from '../AirBalanceBar'
import GasBalanceBar from '../GasBalanceBar'
import LicenseBar from '../LicenseBar'

interface Props {
  toggleSidebar: () => void
}

const WithAuth = ({ toggleSidebar }: Props) => {
  return (
    <>
      <LicenseBar />
      <GasBalanceBar />
      <AirBalanceBar />
      <IconButton onClick={toggleSidebar} edge='start' color='inherit' aria-label='menu'>
        <MoreVertIcon />
      </IconButton>
    </>
  )
}

export default WithAuth
