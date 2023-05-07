import { useCallback, useMemo, useState } from "react";
import type { NextPage } from "next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
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
import { FRoute } from "types";
import { Flight } from "types";

const GridItem: React.FC<{
  flights: FRoute[];
  delay: number;
  origin: string;
  onSelect: (origin: string, destination: string) => void;
}> = ({ flights, delay, origin, onSelect }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onSelect(origin, event.target.value as string);
  };

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
  const { flights, atcs } = useVaProviderContext();
  const [selected, setSelected] = useState<FRoute>({
    origin: "",
    destination: "",
  });

  const handleSelect = useCallback((origin: string, destination: string) => {
    setSelected({ origin, destination });
  }, []);

  const distance = useMemo(() => {
    if (!selected.origin) return 0;
    const originTower = atcs.find((a) =>
      a.callsign.startsWith(selected.origin)
    );
    if (!originTower) return 0;
    const arrivalTower = atcs.find((a) =>
      a.callsign.startsWith(selected.destination)
    );
    if (!arrivalTower) return 0;
    const originCoords = {
      latitude: originTower.lastTrack.latitude,
      longitude: originTower.lastTrack.longitude,
    };
    const arrivalCoords = {
      latitude: arrivalTower.lastTrack.latitude,
      longitude: arrivalTower.lastTrack.longitude,
    };

    const horizontal = Math.pow(
      arrivalCoords.longitude - originCoords.longitude,
      2
    );
    const vertical = Math.pow(
      arrivalCoords.latitude - originCoords.latitude,
      2
    );

    const result = Math.sqrt(horizontal + vertical);
    return result * 100;
  }, [atcs, selected]);

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
        </Box>

        <Grid container spacing={2}>
          {!!selected.origin && (
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
                    }).format(distance)}{" "}
                    km
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h2">{selected.destination}</Typography>
                </Box>
              </Stack>
            </Grid>
          )}
          {!selected.origin &&
            Object.keys(flights).length > 0 &&
            Object.entries(flights as Flight).map(([key, value], index) => (
              <GridItem
                onSelect={handleSelect}
                key={key}
                origin={key}
                flights={value}
                delay={500 * (index + 1)}
              />
            ))}
          {
            <Box>
              <Typography>No hay vuelos</Typography>
            </Box>
          }
        </Grid>
      </Container>
    </Box>
  );
};

export default Cargo;
