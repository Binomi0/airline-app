import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useVaProviderContext } from "../context/VaProvider";

interface IIvaoAtc {
  callsign: string;
}

const reduceDuplicated = (acc: string[], curr: IIvaoAtc) => {
  const [airport] = curr.callsign.split("_");
  if (acc.includes(airport)) return acc;
  return [...acc, airport];
};

const IVAOPage = () => {
  const ivaoRef = useRef<HTMLInputElement>();
  const [step, setStep] = useState(0);
  const [pilot, setPilot] = useState(0);
  const { pilots, atcs } = useVaProviderContext();

  console.log("pilots", pilots);
  // console.log("atcs", atcs);

  const createCargo = useCallback(() => {
    setStep(1);
  }, []);
  const handleClick = useCallback(() => {
    const found = pilots.find(
      (p) => p.userId === Number(ivaoRef?.current?.value)
    );
    if (found) {
      setPilot(found);
      setStep(2);
    } else {
    }
  }, [pilots]);

  return (
    <Container>
      <Box mt={10}>
        {step === 0 && (
          <Button variant="contained" size="large" onClick={createCargo}>
            Start Tracking
          </Button>
        )}
        {step === 1 && (
          <Box>
            <Card>
              <CardContent>
                <Typography>Introduce tu ID de pilot en IVAO</Typography>
                <TextField inputRef={ivaoRef} />
              </CardContent>
              <CardActions>
                <Button onClick={handleClick} variant="contained">
                  Start Tracking
                </Button>
              </CardActions>
            </Card>
          </Box>
        )}
        {step === 2 && (
          <Grid container maxWidth={400}>
            {Object.entries(pilot).map(([key, value]) => {
              if (typeof value === "string" || typeof value === "number") {
                return (
                  <Grid item key={key} xs={12}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>{key}:</Typography>
                      <Typography>{value}</Typography>
                    </Stack>
                  </Grid>
                );
              } else if (typeof value === "object") {
                return Object.entries(value).map(([subKey, subValue]) => {
                  if (
                    typeof subValue === "string" ||
                    typeof subValue === "number"
                  ) {
                    return (
                      <Grid item key={subKey} xs={12}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>{subKey}:</Typography>
                          <Typography>{subValue}</Typography>
                        </Stack>
                      </Grid>
                    );
                  }
                });
              }
            })}
            <Grid item xs={6}></Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default IVAOPage;
