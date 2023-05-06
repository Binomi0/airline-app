import type { NextPage } from "next";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Grow,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import styles from "../styles/Home.module.css";
import image from "public/img/Cyb3rYoga.png";
import Image from "next/image";

const GridItem: React.FC<{
  link: string;
  title: string;
  text: string;
  delay: number;
}> = ({ link, title, text, delay }) => {
  const theme = useTheme();

  console.log("palette =>", theme.palette);
  return (
    <Grow in timeout={{ enter: delay }}>
      <Grid item xs={12} md={6} lg={6} p={2}>
        <Link href={link} underline="none">
          <Card className={styles.card}>
            <CardContent className={styles.text}>
              <Typography component="h4" variant="h4" color="white" paragraph>
                {title}
              </Typography>
              <Typography color="white">{text}</Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    </Grow>
  );
};

const Home: NextPage = () => (
  <Box position="relative">
    <Image
      alt="banner"
      className={styles.background}
      fill
      placeholder="blur"
      priority
      src={image}
    />

    <Container>
      <Box my={5} textAlign="center">
        <Typography variant="h1">Virtual Airline</Typography>
      </Box>

      <Grid container spacing={8}>
        <GridItem
          delay={500}
          link="/hangar"
          title="Hangar &rarr;"
          text="Aircrafts, buy and sell aircraft NFT's"
        />
        <GridItem
          delay={1000}
          link="/license"
          title="Licencias &rarr;"
          text="Grow, adquire a licence and start flying today."
        />

        <GridItem
          delay={1500}
          link="/gas"
          title="Gas &rarr;"
          text="Stake and earn Gas to refuel your aircrafts."
        />
        <GridItem
          delay={2000}
          link="/cargo"
          title="Cargo &rarr;"
          text="Realiza alguno de los vuelos pendientes y gana tokens
                      AIRL."
        />
        <GridItem
          delay={2500}
          link="/ivao"
          title="IVAO &rarr;"
          text="Monitoriza tus vuelos en IVAO y gana recompensas."
        />
      </Grid>
    </Container>
  </Box>
);

export default Home;
