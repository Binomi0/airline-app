import React from "react";
import {
  AppBar,
  Avatar,
  AvatarGroup,
  CircularProgress,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ConnectWallet,
  MediaRenderer,
  useAddress,
  useBalance,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { useMainProviderContext } from "context/MainProvider";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import {
  coinTokenAddress,
  nftLicenseTokenAddress,
  rewardTokenAddress,
} from "contracts/address";
import BigNumber from "bignumber.js";
import useMediaQuery from "@mui/material/useMediaQuery";

const CustomAppBar: React.FC = () => {
  const matches = useMediaQuery("(min-width:768px)");
  const address = useAddress();
  const { toggleSidebar } = useMainProviderContext();
  const { data: airlBalance, isLoading: airlLoading } =
    useBalance(coinTokenAddress);
  const { data: gasBalance, isLoading: airgLoading } =
    useBalance(rewardTokenAddress);
  const { contract: licenseContract } = useContract(
    nftLicenseTokenAddress,
    "edition-drop"
  );
  const { data: ownedLicense, isLoading } = useOwnedNFTs(
    licenseContract,
    address
  );

  return (
    <AppBar position="sticky" color="transparent">
      <Toolbar>
        <IconButton
          onClick={toggleSidebar}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {matches ? "Decentralized Virtual Airline" : "DVA"}
        </Typography>
        <Stack direction="row" alignItems="center" height={50} spacing={1}>
          {isLoading && address ? (
            <CircularProgress size={25} />
          ) : (
            ownedLicense &&
            ownedLicense?.length > 0 && (
              <AvatarGroup>
                {ownedLicense
                  .map((license) => (
                    <Tooltip
                      arrow
                      title={(license.metadata.name as string).split(" - ")[1]}
                      key={license.metadata.id}
                    >
                      <Avatar>
                        <MediaRenderer
                          width="50px"
                          height="50px"
                          src={license?.metadata.image}
                        />
                      </Avatar>
                    </Tooltip>
                  ))
                  .reverse()}
              </AvatarGroup>
            )
          )}
          {airlLoading && address ? (
            <CircularProgress size={25} />
          ) : (
            matches && (
              <Stack direction="row" alignItems="center" mx={2} spacing={1}>
                <LocalGasStationIcon color="inherit" fontSize="medium" />
                <Typography variant="h6">
                  {Intl.NumberFormat("en", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(
                    new BigNumber(gasBalance?.displayValue || 0).toNumber()
                  )}{" "}
                  AIRG
                </Typography>
              </Stack>
            )
          )}
          {airgLoading && address ? (
            <CircularProgress size={25} />
          ) : (
            matches && (
              <Stack direction="row" alignItems="center" mx={2} spacing={1}>
                <AirplaneTicketIcon color="inherit" fontSize="medium" />
                <Typography variant="h6">
                  {Intl.NumberFormat("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    new BigNumber(airlBalance?.displayValue || 0).toNumber()
                  )}{" "}
                  AIRL
                </Typography>
              </Stack>
            )
          )}
          <ConnectWallet style={{ height: "50px" }} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
