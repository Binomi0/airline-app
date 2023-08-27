import { Close } from '@mui/icons-material'
import { Stack, TextField, IconButton, Button } from '@mui/material'
import React from 'react'

interface Props {
  onCancel: () => void
  onSubmit: (value: string) => void
  loading: boolean
}

const CodeInput = ({ onCancel, onSubmit, loading }: Props) => {
  const codeRef = React.useRef<HTMLInputElement>(null)
  const [error, setError] = React.useState('')

  const handleValidateCode = React.useCallback(() => {
    if (!codeRef.current?.value) return

    const isValid = Number(codeRef.current.value) > 999 && Number(codeRef.current.value) < 10000
    if (isValid) onSubmit(codeRef.current.value)

    setError(isValid ? '' : 'Invalid code')
  }, [onSubmit])

  return (
    <Stack direction='row' spacing={2}>
      <TextField
        inputProps={{
          style: { color: 'white' }
        }}
        autoFocus
        disabled={loading}
        variant='outlined'
        size='small'
        label='CODE'
        error={!!error}
        helperText={error}
        placeholder='Insert code'
        inputRef={codeRef}
        InputProps={{
          endAdornment: (
            <IconButton onClick={onCancel}>
              <Close />
            </IconButton>
          )
        }}
      />
      <Button disabled={loading} variant='contained' onClick={handleValidateCode}>
        SEND CODE
      </Button>
    </Stack>
  )
}

export default CodeInput
