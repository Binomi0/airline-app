import Close from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import React from 'react'

interface Props {
  onCancel: () => void
  // eslint-disable-next-line no-unused-vars
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

  return loading ? (
    <CircularProgress />
  ) : (
    <Stack direction='row' spacing={2}>
      <TextField
        inputProps={{
          style: { color: 'white' }
        }}
        autoFocus
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
      <Button variant='contained' onClick={handleValidateCode}>
        SEND CODE
      </Button>
    </Stack>
  )
}

export default CodeInput
