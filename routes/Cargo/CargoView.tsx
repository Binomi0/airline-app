import { createRef, useState } from "react";
import type { NextPage } from "next";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Fade,
  LinearProgress,
  Typography,
} from "@mui/material";
import Image from "next/image";
import styles from "styles/Home.module.css";
import image from "public/img/airplanes9.png";
import { useVaProviderContext } from "context/VaProvider";
import { FRoute } from "types";
import useCargo from "hooks/useCargo";
import { ConnectWallet, NFT, useAddress, useUser } from "@thirdweb-dev/react";
import NoAddress from "routes/Cargo/components/NoAddress";
import CargoReady from "routes/Cargo/components/CargoReady";
import CargoList from "routes/Cargo/components/CargoList";

const initialState: FRoute = {
  origin: "",
  destination: "",
};

const CargoView: NextPage<{ loading: boolean; aircraft?: NFT }> = ({
  loading,
  aircraft,
}) => {
  const address = useAddress();
  const { isLoggedIn } = useUser();
  const { newCargo, cargo } = useCargo();
  const { flights } = useVaProviderContext();
  const [selected, setSelected] = useState(initialState);

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
          {!address && <ConnectWallet />}
        </Box>

        <NoAddress />

        <Fade in={isLoggedIn && !!address && !!selected.origin} unmountOnExit>
          <Box>
            <CargoReady
              cargo={cargo}
              onCancel={() => setSelected(initialState)}
            />
          </Box>
        </Fade>
        <Fade in={isLoggedIn && !!address && !selected.origin} unmountOnExit>
          <Box>
            <CargoList
              aircraft={aircraft}
              flights={flights}
              newCargo={newCargo}
              setSelected={setSelected}
            />
          </Box>
        </Fade>
        <Fade in={Object.keys(flights).length < 2} unmountOnExit>
          <Box textAlign="center">
            {Object.keys(flights).length === 0 && (
              <Typography variant="h4" color="white">
                No hay control en torre activo en este momento en España
              </Typography>
            )}
            <Alert
              severity="info"
              action={<Button onClick={() => {}}>Actualizar</Button>}
            >
              <AlertTitle>
                Se necesitan un mínimo de 2 torres de control contectadas
                simultáneamente para poder realizar una ruta.
              </AlertTitle>
            </Alert>
          </Box>
        </Fade>
        <Fade in={!address || !isLoggedIn} unmountOnExit>
          <Box maxWidth={500} m="auto">
            <Alert severity="warning">
              <AlertTitle>ACCESO NO PERMITIDO</AlertTitle>
              <Typography gutterBottom>
                Tienes que conectar e iniciar sesión con tu cuenta para poder
                ver los vuelos disponibles.
              </Typography>
              {address && (
                <Typography paragraph variant="body2">
                  Para acceder, tendrás que demostrar con una firma que eres el
                  legítimo dueño de la cuenta con la que estás intentando
                  conectar.
                </Typography>
              )}
              <ConnectWallet />
            </Alert>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CargoView;
