import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import { styled, alpha } from '@mui/material/styles'
import { INft } from 'models/Nft'
import axios from 'axios'
import Swal from 'sweetalert2'

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  maxWidth: '90vw',
  background: theme.palette.mode === 'dark' ? '#111827' : '#fff',
  borderRadius: '24px',
  boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
  padding: theme.spacing(4),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  outline: 'none'
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: alpha(theme.palette.action.hover, 0.05)
  }
}))

interface CreateListingModalProps {
  open: boolean
  onClose: () => void
  nft: INft | null
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ open, onClose, nft }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    price: '',
    currency: 'AIRL',
    type: 'SALE',
    expiresIn: '7' // days
  })

  if (!nft) return null

  const handleSubmit = async () => {
    if (!formData.price || isNaN(Number(formData.price))) {
      Swal.fire('Error', 'Por favor ingresa un precio válido', 'error')
      return
    }

    setLoading(true)
    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + Number(formData.expiresIn))

      await axios.post('/api/marketplace', {
        nftId: nft._id,
        price: formData.price,
        currency: formData.currency,
        type: formData.type,
        tokenId: nft.id.toString(),
        tokenAddress: nft.tokenAddress,
        chainId: nft.chainId,
        expiresAt
      })

      Swal.fire('¡Listado Creado!', 'Tu aeronave ya está disponible en el mercado.', 'success')
      onClose()
    } catch (error: any) {
      console.error(error)
      Swal.fire('Error', error.response?.data?.error || 'No se pudo crear el listado', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent>
        <Typography variant="h5" fontWeight={800} mb={3}>
          Listar <span style={{ color: '#6366f1' }}>Aeronave</span>
        </Typography>

        <Box display="flex" gap={2} mb={3} alignItems="center">
          <img 
            src={nft.metadata.image} 
            alt={nft.metadata.name as string} 
            style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: '12px' }} 
          />
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>{nft.metadata.name}</Typography>
            <Typography variant="caption" color="text.secondary">ID: {nft.id.toString()}</Typography>
          </Box>
        </Box>

        <Stack spacing={3}>
          <StyledTextField
            select
            fullWidth
            label="Tipo de Listado"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="SALE">Venta Directa</MenuItem>
            <MenuItem value="RENT">Alquiler Operativo</MenuItem>
          </StyledTextField>

          <Box display="flex" gap={2}>
            <StyledTextField
              fullWidth
              label="Precio"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <StyledTextField
              select
              sx={{ width: 120 }}
              label="Moneda"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              <MenuItem value="AIRL">AIRL</MenuItem>
              <MenuItem value="AIRG">AIRG</MenuItem>
            </StyledTextField>
          </Box>

          <StyledTextField
            select
            fullWidth
            label="Duración del Listado"
            value={formData.expiresIn}
            onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
          >
            <MenuItem value="1">1 día</MenuItem>
            <MenuItem value="3">3 días</MenuItem>
            <MenuItem value="7">7 días</MenuItem>
            <MenuItem value="30">30 días</MenuItem>
          </StyledTextField>

          <Box display="flex" gap={2} mt={2}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={onClose}
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Cancelar
            </Button>
            <Button 
              fullWidth 
              variant="premium" 
              onClick={handleSubmit}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Listado'}
            </Button>
          </Box>
        </Stack>
      </ModalContent>
    </Modal>
  )
}

export default CreateListingModal
