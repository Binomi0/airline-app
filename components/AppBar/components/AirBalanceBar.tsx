import React, { useCallback, useState } from 'react'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import { Button, CircularProgress, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { coinTokenAddress } from 'contracts/address'
import useTokenBalance from 'hooks/useTokenBalance'

const AirBalanceBar = () => {
  const { balance } = useTokenBalance(coinTokenAddress)
  const [isRequesting, setIsRequesting] = useState(false)
  const [requested, setRequested] = useState(false)

  const handleRequestFunds = useCallback(async () => {
    setIsRequesting(true)
    try {
      const response = await axios.get('/api/request-funds')
      if (response.status === 202) {
        setRequested(true)
      }
    } catch (error) {
      console.log('error funding =>', error)
    } finally {
      setIsRequesting(false)
    }
  }, [])

  return (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <AirplaneTicketIcon color='inherit' fontSize='medium' />
      <Typography variant='h6'>
        {Intl.NumberFormat('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(balance.toNumber())}{' '}
        AIRL
      </Typography>
      {balance?.isZero() && (
        <Button disabled={isRequesting || requested} onClick={handleRequestFunds}>
          {requested ? <CircularProgress color='secondary' size={20} /> : 'Solicitar AIRL'}
        </Button>
      )}
    </Stack>
  )
}

export default AirBalanceBar
