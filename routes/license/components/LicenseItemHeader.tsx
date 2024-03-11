import { CardHeader, Avatar, Collapse, Box, IconButton } from '@mui/material'
import { MediaRenderer } from '@thirdweb-dev/react'
import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

const LicenseItemHeader: React.FC<{
  name: string
  description: string
  image: string
  owned: boolean
}> = ({ name, description, image, owned }) => {
  const [open, setOpen] = useState(false)
  const subheader = open ? description : `${description?.split(' ').slice(0, 8).join(' ')} ...`

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
          <IconButton onClick={() => setOpen((s) => !s)}>
            {open ? (
              <KeyboardArrowUpIcon color='primary' fontSize='large' />
            ) : (
              <KeyboardArrowDownIcon color='primary' fontSize='large' />
            )}
          </IconButton>
        }
      />
      <Collapse in={open}>
        <Box
          sx={{
            position: 'relative',
            top: 0,
            left: 0,
            '&::before': {
              position: 'relative',
              content: `${owned ? "'OWNED'" : "'LOCKED'"}`,
              width: '50px',
              height: '50px',
              top: 10,
              left: 10,
              fontSize: '36px',
              color: `${owned ? 'green' : 'red'}`,
              background: 'white',
              padding: 1,
              borderRadius: 2,
              textShadow: `2px 2px ${owned ? 'lightGreen' : 'orange'}`,
              boxShadow: `0 0 8px 0px ${owned ? 'green' : 'red'}`
            }
          }}
        >
          <MediaRenderer width='100%' src={image} />
        </Box>
      </Collapse>
    </>
  )
}

export default React.memo(LicenseItemHeader)
