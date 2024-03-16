import React from 'react'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import { useTokenProviderContext } from 'context/TokenProvider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface Props {
  show: boolean
  smartAccountAddress?: string
}

const AirBalanceBar = ({ show, smartAccountAddress }: Props) => {
  const { airl } = useTokenProviderContext()

  return show && smartAccountAddress ? (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <AirplaneTicketIcon color='inherit' fontSize='medium' />
      <Typography variant='h6'>
        {Intl.NumberFormat('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(airl?.toNumber() || 0)}{' '}
        AIRL
      </Typography>
    </Stack>
  ) : null
}

export default AirBalanceBar
