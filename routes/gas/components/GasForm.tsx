import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import React, { memo } from 'react'
import type { ChangeEvent } from 'react'

import styles from 'styles/Gas.module.css'

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
    const amount = BigInt(value)
    if (amount === 0n || amount < 0n) return
    setValue('')
    onClick(value)
  }

  return (
    <Stack spacing={2} mt={1}>
      <TextField
        size='small'
        label={label}
        variant='outlined'
        type='number'
        onChange={handleChange}
        value={value}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.5)',
            '&.Mui-focused': {
              color: '#6366f1',
            },
          },
          '& .MuiInputBase-input': {
            color: '#fff',
          }
        }}
        InputProps={{
          endAdornment: (
            <Button
              sx={{ 
                minWidth: 'auto', 
                color: '#6366f1', 
                fontWeight: 700,
                '&:hover': { background: 'rgba(99, 102, 241, 0.1)' }
              }}
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
      <Button 
        className={styles.premiumButton}
        disabled={loading || !value} 
        onClick={handleClick} 
        size='small' 
        variant='contained'
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : buttonText}
      </Button>
    </Stack>
  )
}

export default memo(GasForm)
