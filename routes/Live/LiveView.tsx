import { useMemo, useEffect } from "react";
import type { FC } from "react";
import { Fade, Box, Typography, Button, LinearProgress } from "@mui/material";
import { useVaProviderContext } from "context/VaProvider";
import useCargo from "hooks/useCargo";
import Link from "next/link";

const LiveView: FC = () => {
  const { cargo, getCargo, isLoading } = useCargo();
  const { pilots, setCurrentPilot, active } = useVaProviderContext();
  const pilot = useMemo(
    () => pilots.find((pilot) => pilot.callsign === cargo?.callsign),
    [pilots, cargo]
  );

  useEffect(() => {
    getCargo();
  }, [getCargo]);

  useEffect(() => {
    setCurrentPilot(pilot);
  }, [pilot, setCurrentPilot]);

  if (isLoading) return <LinearProgress />;

  return (
    <>
      <Fade in={!active && !pilot} unmountOnExit timeout={{ exit: 0 }}>
        <Box mt={10} textAlign="center">
          <Typography variant="h1">Esperando conexión...</Typography>
          <Typography variant="h2">{cargo?.callsign}</Typography>
          <Typography variant="h3">Conéctate a IVAO para continuar.</Typography>
        </Box>
      </Fade>
      <Fade in={!!active && !!pilot} unmountOnExit>
        <Box mt={10}>
          <Typography paragraph>Already connected, tracking...</Typography>
          <Typography>
            {pilot?.lastTrack.onGround ? "En tierra" : "En el aire"}
          </Typography>
          <Typography>Estado ({pilot?.lastTrack.state})</Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setCurrentPilot()}
          >
            Disconnect
          </Button>
        </Box>
      </Fade>
      <Fade in={!cargo && !isLoading}>
        <Box my={10} textAlign="center">
          <Typography variant="h3" paragraph>
            Tienes que configurar un vuelo para empezar el tracking.
          </Typography>
          <Link href="/cargo">
            <Button variant="contained">
              <Typography>Configurar nuevo vuelo</Typography>
            </Button>
          </Link>
        </Box>
      </Fade>
    </>
  );
};

export default LiveView;
