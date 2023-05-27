import React, { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { VaProvider } from "context/VaProvider";
import LiveView from "routes/Live/LiveView";
import { useRouter } from "next/router";
import Link from "next/link";

const LivePage = () => {
  const router = useRouter();
  const callsign = router.query.callsign as string;
  const [current, setCurrent] = React.useState(false);

  useEffect(() => {
    const currentFlight = localStorage.getItem(`cargo-${callsign}`);
    if (currentFlight) {
      setCurrent(true);
    }
  }, [callsign]);

  return (
    <VaProvider>
      <Container>
        {current ? (
          <LiveView callsign={router.query.callsign as string} />
        ) : (
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
        )}
      </Container>
    </VaProvider>
  );
};

export default LivePage;
