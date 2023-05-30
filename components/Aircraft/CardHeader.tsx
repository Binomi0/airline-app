import { CardHeader, Avatar, Collapse, Box, IconButton } from "@mui/material";
import { MediaRenderer, NFT } from "@thirdweb-dev/react";
import { nftAircraftTokenAddress } from "contracts/address";
import router from "next/router";
import React, { startTransition, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const AircraftCardHeader: React.FC<{ nft: NFT }> = ({ nft }) => {
  const [open, setOpen] = useState(false);

  const truncated = `${nft.metadata.description
    ?.split(" ")
    .slice(0, 8)
    .join(" ")} ...`;

  const handleToogle = () => {
    startTransition(() => {
      setOpen((s) => !s);
    });
  };

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
          <IconButton onClick={handleToogle}>
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
          onClick={() =>
            router.push(
              `/aircraft/${nftAircraftTokenAddress}/${nft.metadata.id}`
            )
          }
        >
          <MediaRenderer height="100%" width="100%" src={nft.metadata.image} />
        </Box>
      </Collapse>
    </>
  );
};

export default React.memo(AircraftCardHeader);
