import React from "react";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useUser } from "@thirdweb-dev/react";

const CustomAppBar: React.FC<{ onOpen: (value: boolean) => void }> = ({
  onOpen,
}) => {
  const { isLoggedIn, user } = useUser();

  console.log("user =>", user);
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
        {!isLoggedIn && <Button color="inherit">Login</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
