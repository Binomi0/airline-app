import React from 'react'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { tokenBalanceStore } from 'store/balance.atom'
import { formatNumber } from 'utils'
import { useMediaQuery } from '@mui/material'

const GasBalanceBar = () => {
  const balance = useRecoilValue(tokenBalanceStore)
  const show = useMediaQuery('(min-width:768px)')
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)

  return show && smartAccountAddress ? (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <LocalGasStationIcon color='inherit' fontSize='medium' />
      <Typography fontWeight={600}>{formatNumber(balance?.airg?.toNumber(), 0)} AIRG</Typography>
    </Stack>
  ) : null
}

export default GasBalanceBar
