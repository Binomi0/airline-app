import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import React, { memo } from 'react'
import type { ChangeEvent } from 'react'
import { styled, alpha } from '@mui/material/styles'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '56px',
    borderRadius: '16px',
    backgroundColor: alpha(theme.palette.background.paper, 0.05),
    transition: 'all 0.2s ease-in-out',
    paddingRight: theme.spacing(1.5),
    '& fieldset': {
      borderColor: alpha(theme.palette.divider, 0.1)
    },
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.3)
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px'
    },
    '& input': {
      padding: '16px 14px',
      fontSize: '1rem',
      fontWeight: 600
    }
  },
  '& .MuiInputLabel-root': {
    color: alpha(theme.palette.text.primary, 0.3),
    transform: 'translate(14px, 16px) scale(1)',
    fontWeight: 600,
    fontSize: '0.9rem',
    '&.Mui-focused, &.MuiInputLabel-shrink': {
      color: theme.palette.primary.main,
      transform: 'translate(14px, -11px) scale(0.75)'
    }
  }
}))

const MaxButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  color: theme.palette.primary.main,
  fontWeight: 800,
  fontSize: '0.7rem',
  padding: theme.spacing(0.5, 1.2),
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.15)
  }
}))

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
    if (!value || isNaN(Number(value))) return
    const amount = Number(value)
    if (amount <= 0) return
    setValue('')
    onClick(value)
  }

  return (
    <Stack spacing={2} mt={2}>
      <StyledTextField
        fullWidth
        label={label}
        variant='outlined'
        type='number'
        onChange={handleChange}
        value={value}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <MaxButton
              onClick={() => {
                setValue(max)
              }}
              size='small'
            >
              MAX
            </MaxButton>
          )
        }}
      />
      <Button disabled={loading || !value || Number(value) <= 0} onClick={handleClick} variant='premium' fullWidth>
        {loading ? <CircularProgress size={24} color='inherit' /> : buttonText}
      </Button>
    </Stack>
  )
}

export default memo(GasForm)
