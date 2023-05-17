import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const LinkItem: React.FC<{
  onLink: () => void;
  text: string;
  selected: boolean;
  Icon: typeof HomeIcon;
}> = ({ text, selected, Icon, onLink }) => (
  <ListItem disablePadding>
    <ListItemButton selected={selected} disabled={selected} onClick={onLink}>
      <ListItemIcon>
        <Icon color={selected ? "primary" : "inherit"} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            fontWeight={selected ? 500 : 400}
            color={selected ? "primary" : "black"}
          >
            {text}
          </Typography>
        }
      />
    </ListItemButton>
  </ListItem>
);

export default React.memo(LinkItem);
