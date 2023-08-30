import {
  Container,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
  Avatar,
  Stack
} from '@mui/material'
import { MediaRenderer } from '@thirdweb-dev/react'
import { NFT } from '@thirdweb-dev/sdk'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction } from 'react'

const CargoAircraftSelector: React.FC<{
  setAircraft: Dispatch<SetStateAction<NFT | undefined>>
  owned: NFT[]
}> = ({ setAircraft, owned }) => {
  const router = useRouter()

  const handleSelectAircraft = React.useCallback(
    (nft: NFT) => () => {
      if (router.query.pilot) {
        const url = `cargo/${nft.metadata.id}/new?pilot=${router.query.pilot}`
        router.push(url)
      }
    },
    [router]
  )

  return (
    <Container>
      <Stack direction='row' justifyContent='center'>
        <Box mt={10}>
          <Typography variant='h6'>Para realizar un vuelo es necesario que elijas una aeronave antes.</Typography>
          <List
            sx={{ width: '100%', minWidth: 360, bgcolor: 'background.paper' }}
            component='nav'
            aria-labelledby='nested-list-subheader'
            subheader={
              <ListSubheader component='div' id='nested-list-subheader'>
                Selecciona una aeronave
              </ListSubheader>
            }
          >
            {owned.map((nft) => (
              <ListItemButton key={nft.metadata.id} onClick={handleSelectAircraft(nft)}>
                <ListItemIcon>
                  <Avatar variant='square'>
                    <MediaRenderer width='50px' height='50px' src={nft?.metadata.image} />
                  </Avatar>
                </ListItemIcon>
                <Typography color='common.black'>{nft.metadata.name}</Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Stack>
    </Container>
  )
}

export default CargoAircraftSelector
