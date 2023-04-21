import { ConnectWallet } from "@thirdweb-dev/react";
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
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback } from "react";

type LicenseType = "A" | "B" | "C" | "D";

const user: Record<string, string[]> = {
  license: ["", "", "", ""],
};

const items: Record<string, string | number>[] = [
  {
    id: "D",
    price: 10,
    name: "Licencia D",
    description: "Licencia Delta, básica con la que empezar si eres nuevo",
    type: "D",
  },
  {
    id: "C",
    price: 20,
    name: "Licencia C",
    description: "Licencia Charlie, para pilotos que han superado la D",
    type: "C",
  },
  {
    id: "B",
    price: 50,
    name: "Licencia B",
    description: "Licencia Bravo, para pilotos que han superado la C",
    type: "B",
  },
  {
    id: "A",
    price: 100,
    name: "Licencia A",
    description: "Licencia Alpha, para pilotos que han superado la B",
    type: "A",
  },
];

const License: NextPage = () => {
  const canGetLicense = useCallback((license: LicenseType) => {
    switch (license) {
      case "D":
        return true;
      case "C":
        return user.license.includes("D");
      case "B":
        return user.license.includes("C");
      case "A":
        return user.license.includes("B");
      default:
        return false;
    }
  }, []);
  return (
    <Container>
      <Box my={10} textAlign="center">
        <Typography variant="h1">Virtual Airline</Typography>
        <ConnectWallet />
      </Box>

      <Box my={10}>
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={4} key={item.id}>
              <Card>
                <CardHeader title={item.name} subheader={item.description} />
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Price</Typography>
                    <Typography variant="body2">{item.price}</Typography>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button
                    disabled={!canGetLicense(item.type as LicenseType)}
                    variant="contained"
                  >
                    Comprar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={4} p={2}>
          <Link href="/">
            <Typography variant="h4" paragraph>
              Home &rarr;
            </Typography>
          </Link>
          <Typography>Ir a la página principal</Typography>
        </Grid>
        <Grid item xs={4} p={2}>
          <Link href="/hangar">
            <Typography variant="h4" paragraph>
              Hangar &rarr;
            </Typography>
          </Link>
          <Typography>Aircrafts, buy and sell aircraft NFT&apos;s</Typography>
        </Grid>
        <Grid item xs={4}>
          <Link href="/gas">
            <Typography variant="h4" paragraph>
              Gas &rarr;
            </Typography>
          </Link>
          <Typography>
            Stake tokens and earn Gas to refuel your aircrafts.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default License;
