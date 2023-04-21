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

const items: Record<string, string | number>[] = [
  {
    id: "C172",
    price: 0.01,
    name: "C172",
    description: "Cessna 172",
    type: "D",
    capacity: 200,
    deposit: 100,
  },
  {
    id: "C700",
    price: 0.05,
    name: "C700",
    description: "Cessna Citation Longitude",
    type: "C",
    capacity: 2000,
    deposit: 1000,
  },
];

const Hangar: NextPage = () => {
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
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Capacity</Typography>
                    <Typography variant="body2">{item.capacity}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Deposit</Typography>
                    <Typography variant="body2">{item.deposit}</Typography>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button variant="contained">Comprar</Button>
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
          <Link href="/license">
            <Typography variant="h4" paragraph>
              Licencias &rarr;
            </Typography>
          </Link>
          <Typography>
            Grow, adquire a licence and start flying today.
          </Typography>
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

export default Hangar;
