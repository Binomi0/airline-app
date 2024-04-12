import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'

const LinkItem: React.FC<{
  onLink: () => void
  text: string
  selected: boolean
  Icon: typeof HomeIcon
  disabled?: boolean
}> = ({ disabled, text, selected, Icon, onLink }) => (
  <ListItem disablePadding>
    <ListItemButton disabled={disabled || selected} selected={selected} onClick={onLink}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={<Typography fontWeight={selected ? 500 : 400}>{text}</Typography>} />
    </ListItemButton>
  </ListItem>
)

export default React.memo(LinkItem)
