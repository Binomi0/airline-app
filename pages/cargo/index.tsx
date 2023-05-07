import { useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Fade,
  FormControl,
  Grid,
  Grow,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import styles from "styles/Home.module.css";
import image from "public/img/airplanes9.png";
import { useVaProviderContext } from "context/VaProvider";
import { Atc, FRoute } from "types";
import { Flight } from "types";
import { getDistanceByCoords } from "utils";
import useCargo from "hooks/useCargo";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

const initialState = {
  origin: "",
  destination: "",
};

const GridItem: React.FC<{
  flights: FRoute[];
  delay: number;
  origin: string;
  onSelect: (origin: string, destination: string) => void;
}> = ({ flights, delay, origin, onSelect }) => {
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      onSelect(origin, event.target.value as string);
    },
    [onSelect, origin]
  );

  return (
    <Grow in timeout={{ enter: delay }}>
      <Grid item xs={12} md={6} lg={4} xl={3} p={2}>
        <Card className={styles.card}>
          <CardHeader
            title={
              <Typography variant="h2" color="white">
                {origin}
              </Typography>
            }
          />
          <CardContent>
            <FormControl fullWidth>
              <InputLabel id="flight-destination-select">
                Destination
              </InputLabel>
              <Select
                defaultValue=""
                labelId="flight-destination-select"
                id="destination-select"
                label="Destination"
                onChange={handleChange}
              >
                <MenuItem disabled value="">
                  Select destination
                </MenuItem>
                {flights.map(({ destination }) => (
                  <MenuItem value={destination} key={destination}>
                    {destination}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
    </Grow>
  );
};

const Cargo: NextPage<{ loading: boolean }> = ({ loading }) => {
  const address = useAddress();
  const { flights } = useVaProviderContext();
  const [selected, setSelected] = useState<FRoute>(initialState);
  const { newCargo, cargo } = useCargo();

  const handleSelect = useCallback(
    (origin: string, destination: string) => {
      newCargo(origin, destination);
      setSelected({ origin, destination });
    },
    [newCargo]
  );

  if (loading || !flights) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Image
        priority
        className={styles.background}
        src={image}
        alt="banner"
        fill
      />
      <Container>
        <Box my={10} textAlign="center">
          <Typography variant="h1">Virtual Airline</Typography>
          {!address && <ConnectWallet />}
        </Box>

        <Fade in={!!selected.origin} unmountOnExit>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="h2">{selected.origin}</Typography>
                </Box>
                <Box
                  sx={{
                    height: 20,
                    background: "white",
                    p: 0,
                    mx: 2,
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    fontWeight={500}
                    color="primary.main"
                    letterSpacing={2}
                  >
                    {Intl.NumberFormat("es", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(cargo?.distance || 0)}{" "}
                    km
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h2">{selected.destination}</Typography>
                </Box>
              </Stack>
              <Box my={4}>
                <Alert severity="info">
                  <AlertTitle>Cargo: {cargo?.details?.name}</AlertTitle>
                  <Typography variant="subtitle2">
                    {cargo?.details?.description}
                  </Typography>
                </Alert>
              </Box>
              <Box my={4}>
                <Stack spacing={2}>
                  <Button
                    disabled={!address}
                    color="secondary"
                    variant="contained"
                    fullWidth
                    onClick={() => {}}
                  >
                    Volar inmediatamente
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setSelected(initialState)}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Fade>
        <Fade
          in={!selected.origin && Object.keys(flights).length > 0}
          unmountOnExit
        >
          <Grid container spacing={2}>
            {Object.entries(flights as Flight).map(([key, value], index) => (
              <GridItem
                onSelect={handleSelect}
                key={key}
                origin={key}
                flights={value}
                delay={500 * (index + 1)}
              />
            ))}
            <Typography>No hay vuelos</Typography>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default Cargo;
