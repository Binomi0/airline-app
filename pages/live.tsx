import React from "react";
import { Container } from "@mui/material";
import { VaProvider } from "context/VaProvider";
import LiveView from "routes/Live/LiveView";

const LivePage = () => {
  return (
    <VaProvider>
      <Container>
        <LiveView />
      </Container>
    </VaProvider>
  );
};

export default LivePage;
