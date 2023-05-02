import {
  ConnectWallet,
  useAddress,
  useContract,
  useNFTBalance,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { nftLicenseTokenAddress } from "contracts/address";

const Cargo: NextPage = () => {
  const address = useAddress();
  const { contract } = useContract(nftLicenseTokenAddress);
  const { data: licenseD = [] } = useNFTBalance(contract, address, 0);

  return (
    <Container>
      <Box my={10} textAlign="center">
        <Typography variant="h1">Virtual Airline</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={4} p={2}>
          <Card>
            <CardHeader title="LEAL/LEVC" subheader="Prize: 50 AIRL" />
            <CardContent>
              <Typography>Carga 200 kg de almendras</Typography>
            </CardContent>
            <CardActions>
              <Button
                disabled={licenseD.toString() !== "1"}
                variant="contained"
              >
                Reservar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cargo;
