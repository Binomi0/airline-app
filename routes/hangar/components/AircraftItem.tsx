import React from 'react'
import Image from 'next/image'
import { Box, Typography, Paper } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import { INft } from 'models/Nft'
import useAircraft from 'hooks/useAircraft'
import StatusBadge from 'components/ui/StatusBadge'

const StyledItemThumbnail = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isActive'
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  minWidth: 240,
  backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.background.paper, 0.05),
  border: `1px solid ${isActive ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '16px',
  padding: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: isActive ? `0 0 20px ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
    transform: 'translateY(-5px)',
    borderColor: alpha(theme.palette.primary.main, 0.4)
  }
}))

const ThumbImageWrapper = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '16/9'
}))

interface Props {
  nft: INft
  isActive: boolean
  onClick: () => void
}

const AircraftItem = ({ nft, isActive, onClick }: Props) => {
  const { hasAircraft } = useAircraft(nft.id as string)

  return (
    <StyledItemThumbnail isActive={isActive} onClick={onClick}>
      <ThumbImageWrapper>
        <Image
          src={nft.metadata.image as string}
          alt={nft.metadata.name as string}
          fill
          style={{ objectFit: 'contain' }}
        />
      </ThumbImageWrapper>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='subtitle2' fontWeight={600}>
          {nft.metadata.name as string}
        </Typography>
        {hasAircraft && (
          <StatusBadge status='success' size='small'>
            PROPIO
          </StatusBadge>
        )}
      </Box>
    </StyledItemThumbnail>
  )
}

export default React.memo(AircraftItem)
