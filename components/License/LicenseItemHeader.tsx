import { CardHeader, Avatar, Collapse, Box, IconButton } from "@mui/material";
import { MediaRenderer, NFT } from "@thirdweb-dev/react";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const LicenseItemHeader: React.FC<{ nft: NFT; owned: boolean }> = ({
  nft,
  owned,
}) => {
  const [open, setOpen] = useState(false);

  const truncated = React.useMemo(
    () => `${nft.metadata.description?.split(" ").slice(0, 8).join(" ")} ...`,
    [nft.metadata.description]
  );

  return (
    <>
      <CardHeader
        sx={{
          alignItems: "flex-start",
        }}
        avatar={
          <Avatar variant="rounded">
            <MediaRenderer
              width="50px"
              height="50px"
              src={nft.metadata.image}
            />
          </Avatar>
        }
        title={nft.metadata.name}
        subheader={open ? nft.metadata.description : truncated}
        action={
          <IconButton onClick={() => setOpen((s) => !s)}>
            {open ? (
              <KeyboardArrowUpIcon color="primary" fontSize="large" />
            ) : (
              <KeyboardArrowDownIcon color="primary" fontSize="large" />
            )}
          </IconButton>
        }
      />
      <Collapse in={open}>
        <Box
          sx={{
            position: "relative",
            top: 0,
            left: 0,
            "&::before": {
              position: "relative",
              content: `${owned ? "'OWNED'" : "'LOCKED'"}`,
              width: "50px",
              height: "50px",
              top: 10,
              left: 10,
              fontSize: "36px",
              color: `${owned ? "green" : "red"}`,
              background: "white",
              padding: 1,
              borderRadius: 2,
              textShadow: `2px 2px ${owned ? "lightGreen" : "orange"}`,
              boxShadow: `0 0 8px 0px ${owned ? "green" : "red"}`,
            },
          }}
        >
          <MediaRenderer width="100%" src={nft.metadata.image} />
        </Box>
      </Collapse>
    </>
  );
};

export default React.memo(LicenseItemHeader);
