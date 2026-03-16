import React from 'react'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { useRecoilValue } from 'recoil'
import { tokenBalanceStore } from 'store/balance.atom'
import { formatNumber } from 'utils'
import { useMediaQuery } from '@mui/material'

const AirBalanceBar = () => {
  const balance = useRecoilValue(tokenBalanceStore)
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const show = useMediaQuery('(min-width:768px)')

  return show && smartAccountAddress ? (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <AirplaneTicketIcon color='inherit' fontSize='medium' />
      <Typography fontWeight={600}>{formatNumber(Number(balance.airl !== undefined ? balance.airl / 10n ** 18n : 0n))} AIRL</Typography>
    </Stack>
  ) : null
}

export default AirBalanceBar
