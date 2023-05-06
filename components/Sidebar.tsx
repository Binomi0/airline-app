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
import { useRouter } from "next/router";
import ConstructionIcon from "@mui/icons-material/Construction";
import HomeIcon from "@mui/icons-material/Home";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";

const Sidebar: React.FC<{
  onOpen: (open: boolean) => void;
  open: boolean;
}> = ({ onOpen, open }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = React.useCallback(
    (text: string) => {
      router.push(text);
      onOpen(false);
    },
    [onOpen, router]
  );

  return (
    <Drawer
      open={open}
      onClose={() => onOpen(false)}
      PaperProps={{ sx: { backgroundColor: "rgba(255,255,255,0.75)" } }}
    >
      <Box p={2} color="white">
        <Typography color="primary" variant="h2">
          AIRLINE
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding onClick={() => handleClick("/")}>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => handleClick("/hangar")}>
          <ListItemButton>
            <ListItemIcon>
              <ConstructionIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Hangar" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => handleClick("/license")}>
          <ListItemButton>
            <ListItemIcon>
              <WorkspacePremiumIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="License" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => handleClick("/gas")}>
          <ListItemButton>
            <ListItemIcon>
              <LocalGasStationIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Gas Station" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => handleClick("/cargo")}>
          <ListItemButton>
            <ListItemIcon>
              <AddHomeWorkIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Main Cargo" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => handleClick("/ivao")}>
          <ListItemButton>
            <ListItemIcon>
              <LocalAirportIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="IVAO" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
