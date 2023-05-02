import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ConnectWallet } from "@thirdweb-dev/react";

const CustomAppBar: React.FC<{ onOpen: (value: boolean) => void }> = ({
  onOpen,
}) => {
  return (
    <AppBar position="sticky" color="transparent">
      <Toolbar>
        <IconButton
          onClick={() => onOpen(true)}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Decentralized Virtual Airline
        </Typography>
        <ConnectWallet />
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
