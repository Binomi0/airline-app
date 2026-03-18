import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { MediaRenderer } from 'thirdweb/react'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction } from 'react'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { INft } from 'models/Nft'
import { IUserNftPopulated } from 'models/UserNft'

type Props = {
  owned: Readonly<IUserNftPopulated[]>
}

const CargoAircraftSelector = ({ owned }: Props) => {
  const router = useRouter()
  const { twClient } = useRecoilValue(walletStore)

  const handleSelectAircraft = React.useCallback(
    (nft: INft) => () => {
      if (router.query.pilot) {
        const url = `cargo/${nft.id.toString()}/new?pilot=${router.query.pilot}&origin=${
          router.query.origin
        }&destination=${router.query.destination}`
        router.push(url)
      } else {
        router.push(`cargo/${nft.id.toString()}/new`)
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
            {owned.map(({ nft }) => (
              <ListItemButton key={nft.id.toString()} onClick={handleSelectAircraft(nft)}>
                <ListItemIcon>
                  <Avatar variant='square'>
                    <MediaRenderer client={twClient!} width='50px' height='50px' src={nft?.metadata.image} />
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
