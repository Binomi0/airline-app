import { useState, useMemo, useEffect } from "react";
import type { FC } from "react";
import {
  Fade,
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useVaProviderContext } from "context/VaProvider";
import { useAddress } from "@thirdweb-dev/react";

const LiveView: FC<{ callsign: string }> = ({ callsign }) => {
  const address = useAddress();
  const { pilots, setCurrentPilot, active } = useVaProviderContext();
  const pilot = useMemo(
    () => pilots.find((pilot) => pilot.callsign === callsign),
    [callsign, pilots]
  );

  useEffect(() => {
    setCurrentPilot(pilot);
  }, [pilot, setCurrentPilot]);

  return (
    <>
      <Fade in={!active && !pilot} unmountOnExit timeout={{ exit: 0 }}>
        <Box mt={10} textAlign="center">
          <Typography variant="h1">Esperando conexión...</Typography>
          <Typography variant="h2">{callsign}</Typography>
          <Typography variant="h3">Conéctate a IVAO para continuar.</Typography>
        </Box>
      </Fade>
      <Fade in={!!active && !!pilot} unmountOnExit>
        <Box mt={10}>
          <Typography paragraph>Already connected, tracking...</Typography>
          <Typography>En tierra {pilot?.lastTrack.onGround}</Typography>
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
    </>
  );
};

export default LiveView;
