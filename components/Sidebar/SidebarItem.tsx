import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import {
  Icon,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const LinkItem: React.FC<{
  link: string;
  text: string;
  Icon: typeof HomeIcon;
}> = ({ link, text, Icon }) => (
  <Link href={link}>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <Icon color="primary" />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  </Link>
);

export default React.memo(LinkItem);
