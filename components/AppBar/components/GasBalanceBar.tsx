import React from 'react'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { tokenBalanceStore } from 'store/balance.atom'

interface Props {
  show: boolean
}

const GasBalanceBar = ({ show }: Props) => {
  const balance = useRecoilValue(tokenBalanceStore)
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)

  return show && smartAccountAddress ? (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <LocalGasStationIcon color='inherit' fontSize='medium' />
      <Typography variant='h6'>
        {Intl.NumberFormat('en', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(balance?.airg?.toNumber() || 0)}{' '}
        AIRG
      </Typography>
    </Stack>
  ) : null
}

export default GasBalanceBar
