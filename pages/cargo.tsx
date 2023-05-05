import type { NextPage } from "next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Grow,
  Typography,
  useTheme,
} from "@mui/material";
import styles from "../styles/Home.module.css";
import image from "public/img/airplanes9.png";
import Image from "next/image";

const GridItem: React.FC<{
  cargo: Cargo;
  delay: number;
}> = ({ cargo, delay }) => {
  const theme = useTheme();

  return (
    <Grow in timeout={{ enter: delay }}>
      <Grid item xs={12} md={6} lg={4} xl={3} p={2}>
        {/* <Link href={link} underline="none"> */}
        <Card className={styles.card}>
          <CardHeader
            title={
              <Typography
                variant="subtitle2"
                color="white"
              >{`${cargo.origin}/${cargo.destination}`}</Typography>
            }
            subheader={
              <Typography
                color="white"
                variant="caption"
              >{`Prize: ${cargo.prize} AIRL`}</Typography>
            }
          />
          <CardContent>
            <Typography
              variant="h4"
              color="white"
              paragraph
              sx={{
                textShadow: `2px 2px ${theme.palette.primary.dark}`,
              }}
            >
              New Cargo
            </Typography>
            <Typography className={styles.text} color="white">
              {cargo.description}
            </Typography>
          </CardContent>
        </Card>
        {/* </Link> */}
      </Grid>
    </Grow>
  );
};
const Cargo: NextPage = () => (
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
        {cargos.map((cargo, index) => (
          <GridItem key={cargo.id} cargo={cargo} delay={500 * (index + 1)} />
        ))}
      </Grid>
    </Container>
  </Box>
);

export default Cargo;

const cargos: Cargo[] = [
  {
    id: 1,
    origin: "LEAL",
    destination: "LEVC",
    cargo: "peanuts",
    weight: "100",
    description: "100 kg de peanuts de Alicante a Valencia",
    prize: 50,
  },
  {
    id: 2,
    origin: "LEVC",
    destination: "LEMI",
    cargo: "jewels",
    weight: "50",
    description: "50 kg de jewels de Alicante a Valencia",
    prize: 100,
  },
  {
    id: 3,
    origin: "LEAL",
    destination: "LEVC",
    cargo: "medic",
    weight: "400",
    description: "400 kg de medic de Alicante a Valencia",
    prize: 50,
  },
];

interface Cargo {
  id: number;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  description: string;
  prize: number;
}
