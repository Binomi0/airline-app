import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useVaProviderContext } from "../context/VaProvider";
import moment from "moment";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import AirlinesIcon from "@mui/icons-material/Airlines";

interface IIvaoAtc {
  callsign: string;
}

type LastTrackState =
  | "En Route"
  | "Boarding"
  | "Approach"
  | "Departing"
  | "On Blocks"
  | "Initial Climb"
  | "Landed";

const stateIcons: Record<LastTrackState, ReactNode> = {
  "En Route": <ConnectingAirportsIcon />,
  Boarding: <FlightIcon />,
  Approach: <FlightLandIcon />,
  Departing: <FlightTakeoffIcon />,
  "On Blocks": <AirplaneTicketIcon />,
  "Initial Climb": <FlightTakeoffIcon />,
  Landed: <AirlinesIcon />,
};

const filterLEOrigins = (pilot: IvaoSession) =>
  pilot.flightPlan.departureId?.includes("LE");
const filterStarting = (pilot: IvaoSession) =>
  pilot.lastTrack.state === "Boarding";

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

  // console.log("pilots", pilots);
  // console.log("atcs", atcs);
  const session = useMemo(
    () =>
      pilots.filter(filterLEOrigins).filter(filterStarting)[0] as IvaoSession,
    [pilots]
  );
  console.log("session =>", session);

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
      setStep(3);
    }
  }, [pilots]);

  useEffect(() => {
    if (!!pilots.length) {
      console.log("iniciando step a 1");
      setStep(1);
    }
  }, [pilots]);

  return (
    <Container>
      <Box mt={10}>
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
          <Grid container>
            <Grid item xs={6}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        backgroundColor:
                          session.lastTrack.state === "En Route"
                            ? "success.main"
                            : "info.main",
                      }}
                    >
                      {stateIcons[session?.lastTrack.state as LastTrackState]}
                    </Avatar>
                  }
                  title={`FLIGHT DETECTED (${session.flightPlan.aircraftId}) - [${session.callsign}]`}
                  subheader={`${session.flightPlan.departureId} - ${session.flightPlan.arrivalId}`}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {session.lastTrack.state} (
                    {moment
                      .utc((session.flightPlan.eet - session.time) * 1000)
                      .format("H[h] mm[m]")}
                    )
                  </Typography>
                  <Typography>
                    Hora de salida:{" "}
                    {moment
                      .utc(session.flightPlan.departureTime * 1000)
                      .add(2, "hours")
                      .format("HH:mm")}
                  </Typography>
                  <Typography>
                    Hora aproximada de llegada:{" "}
                    {moment
                      .utc(
                        (session.flightPlan.departureTime +
                          session.flightPlan.eet) *
                          1000
                      )
                      .add(2, "hours")
                      .format("HH:mm")}
                  </Typography>
                  <Typography>
                    Tiempo total estimado del vuelo:{" "}
                    {moment
                      .utc(session.flightPlan.eet * 1000)
                      .format("H[h] mm[m]")}
                  </Typography>
                  <Typography>
                    Tiempo restante:{" "}
                    {moment.utc(session.time * 1000).format("H[h] mm[m]")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        )}
        {step === 3 && (
          <Box>
            <Typography variant="h1">Conéctate a IVAO</Typography>
            <Box my={6}>
              <Button variant="contained" onClick={handleClick}>
                Ya estoy conectado, volver a comprobar
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default IVAOPage;

const userExample = {
  time: 2857,
  id: 52073414,
  userId: 354971,
  callsign: "ALZ219",
  serverId: "WS",
  softwareTypeId: "altitude/win",
  softwareVersion: "1.12.0b",
  rating: 4,
  createdAt: "2023-04-30T21:05:50.000Z",
  lastTrack: {
    altitude: 21344,
    altitudeDifference: -98,
    arrivalDistance: 305.965759,
    departureDistance: 48.245808,
    groundSpeed: 228,
    heading: 243,
    latitude: 38.720837,
    longitude: 0.360621,
    onGround: false,
    state: "En Route",
    timestamp: "2023-04-30T21:53:14.000Z",
    transponder: 5002,
    transponderMode: "N",
    time: 2845,
  },
  flightPlan: {
    id: 56077736,
    revision: 2,
    aircraftId: "BE20",
    aircraftNumber: 1,
    departureId: "LEIB",
    arrivalId: "LEZL",
    alternativeId: "LEMG",
    alternative2Id: null,
    route: "BAVER UM603 ALT UN851 ROLAS DCT VIBAS",
    remarks:
      "COM/TCAS DOF/230430 REG/N201SB EET/LECM0036 OPR/ALZ PER/B RVR/200 RMK/TCAS SIMBRIEF",
    speed: "N0275",
    level: "F270",
    flightRules: "I",
    flightType: "S",
    eet: 5280,
    endurance: 8880,
    departureTime: 77400,
    actualDepartureTime: null,
    peopleOnBoard: 11,
    createdAt: "2023-04-30T21:05:59.000Z",
    updatedAt: "2023-04-30T21:05:59.000Z",
    aircraftEquipments: "SDFG",
    aircraftTransponderTypes: "C",
    aircraft: {
      icaoCode: "BE20",
      model: "King Air 250",
      wakeTurbulence: "L",
      isMilitary: false,
      description: "LandPlane",
    },
  },
  pilotSession: {
    simulatorId: "X-Plane11",
  },
};

type IvaoSession = typeof userExample;
