import { IconButton } from '@mui/material'
import React from 'react'
import SummarizeIcon from '@mui/icons-material/Summarize'
import AirBalanceBar from './AirBalanceBar'
import GasBalanceBar from './GasBalanceBar'
import LicenseBar from './LicenseBar'
import { User } from 'types'

interface Props {
  user?: User
  matches: boolean
  smartAccountAddress?: string
  // eslint-disable-next-line no-unused-vars
  toggleSidebar: (side: 'left' | 'right') => void
}

const AppBarInfo = ({ user, matches, smartAccountAddress, toggleSidebar }: Props) => {
  return (
    !user && (
      <div>
        <LicenseBar />
        <GasBalanceBar show={matches} smartAccountAddress={smartAccountAddress} />
        <AirBalanceBar show={matches} smartAccountAddress={smartAccountAddress} />
        <IconButton
          onClick={() => toggleSidebar('right')}
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          sx={{ mr: 2 }}
        >
          <SummarizeIcon />
        </IconButton>
      </div>
    )
  )
}

export default AppBarInfo
