import React from "react";
import { useRouter } from "next/router";
import { Alert, AlertTitle, Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import image from "public/img/real_replica_cessna_172.png";
import styles from "styles/Home.module.css";

const CargoItem = () => {
  const router = useRouter();

  return (
    <Box sx={{ position: "relative" }}>
      <Image
        priority
        className={styles.background}
        style={{ opacity: 0.4 }}
        src={image}
        alt="banner"
        fill
      />

      <Container>
        <Box my={6}>
          <Box>
            <Typography align="center" variant="h1">
              New Cargo #{router.query.id}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Alert severity="info">
            <AlertTitle>
              Recommended aircraft:{" "}
              <Typography variant="overline">Cessna 172 Skyhawk</Typography>
            </AlertTitle>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
};

export default CargoItem;
