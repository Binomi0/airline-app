import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import BigNumber from 'bignumber.js'
import React, { memo } from 'react'
import type { ChangeEvent } from 'react'

const GasForm: React.FC<{
  max: string
  // eslint-disable-next-line no-unused-vars
  onClick: (value: string) => void
  loading: boolean
  label: string
  buttonText: string
}> = ({ max, onClick, loading, label, buttonText }) => {
  const [value, setValue] = React.useState('')

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function handleClick() {
    const amount = new BigNumber(value)
    if (amount.isZero() || amount.isNaN() || amount.isNegative()) return
    setValue('')
    onClick(value)
  }

  return (
    <Stack spacing={2}>
      <TextField
        size='small'
        focused
        label={label}
        variant='outlined'
        type='number'
        onChange={handleChange}
        value={value}
        InputProps={{
          endAdornment: (
            <Button
              variant='contained'
              onClick={() => {
                setValue(max)
              }}
              size='small'
            >
              MAX
            </Button>
          )
        }}
      />
      <Button color='success' disabled={loading || !value} onClick={handleClick} size='small' variant='contained'>
        {loading ? <CircularProgress size={24} /> : buttonText}
      </Button>
    </Stack>
  )
}

export default memo(GasForm)
