import { useCallback, useState } from "react";
import type { NextPage } from "next";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import styles from "styles/Home.module.css";
import image from "public/img/airplanes9.png";
import { useVaProviderContext } from "context/VaProvider";
import { AircraftName, FRoute } from "types";
import { Flight } from "types";
import useCargo from "hooks/useCargo";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import CargoItem from "routes/Cargo/components/CargoItem";
import CargoAircraft from "routes/Cargo/components/CargoAircraft";

const initialState: FRoute = {
  origin: "",
  destination: "",
};

const CargoView: NextPage<{ loading: boolean }> = ({ loading }) => {
  const address = useAddress();
  const { flights } = useVaProviderContext();
  const [selected, setSelected] = useState(initialState);
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
        <Box my={6} textAlign="center">
          <Typography variant="h1">Virtual Airline</Typography>
          {!address && <ConnectWallet />}
        </Box>

        <Fade in={!address} unmountOnExit>
          <Box textAlign="center">
            <Typography variant="h4">
              Conecta tu wallet para selecionar un vuelo.
            </Typography>
          </Box>
        </Fade>

        <Fade in={!!selected.origin && !!address} unmountOnExit>
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
                <CargoAircraft cargo={cargo} />
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
          in={!selected.origin && Object.keys(flights).length > 0 && !!address}
          unmountOnExit
        >
          <Grid container spacing={2}>
            {Object.entries(flights as Flight).map(([key, value], index) => (
              <CargoItem
                onSelect={handleSelect}
                key={key}
                origin={key}
                flights={value}
                delay={500 * (index + 1)}
              />
            ))}
          </Grid>
        </Fade>
        <Fade in={Object.keys(flights).length === 0 && !!address}>
          <Box textAlign="center">
            <Typography variant="h4" color="white">
              No hay control en torre activo en este momento en España
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CargoView;
