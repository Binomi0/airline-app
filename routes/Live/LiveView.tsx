import React, { useRef } from "react";
import {
  Fade,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { useVaProviderContext } from "context/VaProvider";
import StartIcon from "@mui/icons-material/Start";

const LiveView = () => {
  const { pilots, setCurrentPilot, active } = useVaProviderContext();
  const [error, setError] = React.useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = React.useCallback(() => {
    if (!inputRef.current?.value) return;

    const pilot = pilots.find(
      ({ userId }) => userId.toString() === inputRef.current?.value
    );
    if (pilot) {
      setError("");
      setCurrentPilot(pilot);
    } else {
      setError("Pilot Not found");
    }
  }, [pilots, setCurrentPilot]);

  return (
    <>
      <Fade in={!active} unmountOnExit timeout={{ exit: 0 }}>
        <Box>
          <Box mt={10} textAlign="center">
            <Typography variant="h1">Esperando conexión...</Typography>
            <Typography variant="h3">
              Conéctate a IVAO para continuar.
            </Typography>
          </Box>
          <Box my={10} textAlign="center">
            <TextField
              inputRef={inputRef}
              variant="outlined"
              size="medium"
              color="primary"
              focused
              error={!!error}
              helperText={error}
              label="Enter your IVAO ID"
              inputProps={{
                style: {
                  textAlign: "center",
                  color: "white",
                  fontSize: 30,
                },
                maxLength: 6,
              }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleClick}>
                    <StartIcon color="primary" />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Box>
      </Fade>
      <Fade in={!!active} unmountOnExit>
        <Box mt={10}>
          <Typography paragraph>Already connected, tracking...</Typography>
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
