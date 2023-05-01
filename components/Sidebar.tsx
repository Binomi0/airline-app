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
  useTheme,
} from "@mui/material";
import React from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useRouter } from "next/router";

const Sidebar: React.FC<{
  onOpen: (open: boolean) => void;
  open: boolean;
}> = ({ onOpen, open }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = React.useCallback(
    (text: string) => {
      router.push(text !== "Home" ? text : "/");
      onOpen(false);
    },
    [onOpen, router]
  );

  return (
    <Drawer
      open={open}
      onClose={() => onOpen(false)}
      PaperProps={{ sx: { backgroundColor: theme.palette.primary.dark } }}
    >
      <Box p={2} color="white">
        <Typography variant="h2">AIRLINE</Typography>
      </Box>
      <Divider />
      <List>
        {["Home", "hangar", "license", "gas", "cargo", "ivao"].map(
          (text, index) => (
            <ListItem
              key={text}
              disablePadding
              onClick={() => handleClick(text)}
            >
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
