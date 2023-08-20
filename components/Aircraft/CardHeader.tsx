import React, { startTransition, useState } from 'react'
import router from 'next/router'
import { MediaRenderer, NFT } from '@thirdweb-dev/react'
import { CardHeader, Avatar, Collapse, IconButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { nftAircraftTokenAddress } from 'contracts/address'

const AircraftCardHeader: React.FC<{ nft: NFT }> = ({ nft }) => {
  const [open, setOpen] = useState(false)
  const { name, description, uri, image, id } = nft.metadata
  const subheader = open ? description : `${description?.split(' ').slice(0, 8).join(' ')} ...`

  function handleToogle() {
    startTransition(() => {
      setOpen((s) => !s)
    })
  }

  function handleRedirect() {
    router.push(`/aircraft/${nftAircraftTokenAddress}/${id}`)
  }

  return (
    <>
      <CardHeader
        sx={{
          alignItems: 'flex-start'
        }}
        avatar={
          <Avatar variant='rounded'>
            <MediaRenderer width='50px' height='50px' src={image} />
          </Avatar>
        }
        title={name}
        subheader={subheader}
        action={
          <IconButton onClick={handleToogle}>
            {open ? (
              <KeyboardArrowUpIcon color='primary' fontSize='large' />
            ) : (
              <KeyboardArrowDownIcon color='primary' fontSize='large' />
            )}
          </IconButton>
        }
      />
      <Collapse in={open}>
        <div onClick={handleRedirect}>
          <MediaRenderer height='100%' width='100%' src={image} />
        </div>
      </Collapse>
    </>
  )
}

export default React.memo(AircraftCardHeader)
