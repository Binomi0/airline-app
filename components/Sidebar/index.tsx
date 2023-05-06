import { Box, Divider, Drawer, List, Typography } from "@mui/material";
import React from "react";
import ConstructionIcon from "@mui/icons-material/Construction";
import HomeIcon from "@mui/icons-material/Home";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import { useMainProviderContext } from "context/MainProvider";
import SidebarItem from "./SidebarItem";

const Sidebar: React.FC = () => {
  const { sidebarOpen: open, toggleSidebar } = useMainProviderContext();

  return (
    <Drawer
      open={open}
      onClose={toggleSidebar}
      PaperProps={{ sx: { backgroundColor: "rgba(255,255,255,0.75)" } }}
    >
      <Box p={2} color="white">
        <Typography color="primary" variant="h2">
          AIRLINE
        </Typography>
      </Box>
      <Divider />
      <List>
        <SidebarItem link="/" text="Home" Icon={HomeIcon} />
        <SidebarItem link="/hangar" text="Hangar" Icon={ConstructionIcon} />
        <SidebarItem
          link="/license"
          text="License"
          Icon={WorkspacePremiumIcon}
        />
        <SidebarItem
          link="/gas"
          text="Gas Station"
          Icon={LocalGasStationIcon}
        />
        <SidebarItem link="/cargo" text="Main Cargo" Icon={AddHomeWorkIcon} />
        <SidebarItem link="/ivao" text="IVAO" Icon={LocalAirportIcon} />
      </List>
    </Drawer>
  );
};

export default Sidebar;
