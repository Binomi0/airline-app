import React, { useCallback, useState } from 'react'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import { Button, CircularProgress, Stack, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import axios from 'axios'
import { coinTokenAddress } from 'contracts/address'
import { useBalance } from '@thirdweb-dev/react'

const AirBalanceBar = () => {
  const [isRequesting, setIsRequesting] = useState(false)
  const [requested, setRequested] = useState(false)
  const { data } = useBalance(coinTokenAddress)

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
    <div>
      <Stack direction='row' alignItems='center' mx={2} spacing={1}>
        <AirplaneTicketIcon color='inherit' fontSize='medium' />
        <Typography variant='h6'>
          {Intl.NumberFormat('en', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(new BigNumber(data?.displayValue || 0).toNumber())}{' '}
          AIRL
        </Typography>
      </Stack>

      {data?.value.isZero() && (
        <Button disabled={isRequesting || requested} onClick={handleRequestFunds}>
          {requested ? <CircularProgress color='secondary' size={20} /> : 'Solicitar AIRL'}
        </Button>
      )}
    </div>
  )
}

export default AirBalanceBar
