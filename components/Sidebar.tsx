import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useRouter } from "next/router";

const Sidebar: React.FC<{
  onOpen: (open: boolean) => void;
  open: boolean;
}> = ({ onOpen, open }) => {
  const router = useRouter();

  const handleClick = React.useCallback(
    (text: string) => {
      router.push(text);
      onOpen(false);
    },
    [onOpen, router]
  );

  return (
    <Drawer open={open} onClose={() => onOpen(false)}>
      <Box p={2}>
        <Typography variant="h2">AIRLINE</Typography>
      </Box>
      <Divider />
      <List>
        {["hangar", "license", "gas", "cargo", "ivao"].map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => handleClick(text)}>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
