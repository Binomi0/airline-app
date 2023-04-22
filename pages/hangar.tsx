import {
  ConnectWallet,
  MediaRenderer,
  Web3Button,
  useClaimNFT,
  useContract,
  useNFT,
  useAddress,
  NFT,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  LinearProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo } from "react";

const items: Record<string, string | number>[] = [
  {
    id: "C172",
    price: 0.01,
    name: "C172",
    description: "Cessna 172",
    type: "D",
    capacity: 200,
    deposit: 100,
  },
  {
    id: "C700",
    price: 0.05,
    name: "C700",
    description: "Cessna Citation Longitude",
    type: "C",
    capacity: 2000,
    deposit: 1000,
  },
];

type AttributeType = {
  trait_type: string;
  value: string;
};

interface AircraftAttributes {
  deposit: number;
  cargo: number;
  license: string;
}

interface AirlineNFT {
  metadata: {
    attributes: AircraftAttributes[];
    name: string;
    description: string;
    image: string;
  };
}

const tokenId = 0;
const airlineNFTAddress = "0xe0d50B513edC32F61c672c048c18b1080e6e2393";
const airlineCoinAddress = "0x773F0e20Ab2E9afC479C82105E924C2E0Ada5aa9";

const Hangar: NextPage = () => {
  const address = useAddress();
  const { contract } = useContract(airlineNFTAddress);
  const { data: nft, isLoading, error } = useNFT(contract, tokenId);
  const {
    mutate: claimNFT,
    isLoading: isClaiming,
    error: errorClaiming,
  } = useClaimNFT(contract);

  const handleClick = useCallback(async () => {
    if (!contract) return;
    const tx = await contract.erc1155.claim(tokenId, 1);
    const receipt = tx.receipt; // the transaction receipt

    console.log("RECEIPT =>", receipt);
  }, [contract]);

  const nfts = useCallback((nft: NFT) => {
    if (
      nft.metadata.attributes &&
      Array.isArray(nft.metadata.attributes) &&
      nft.metadata.attributes.length > 0
    ) {
      return nft.metadata.attributes as AttributeType[];
    }

    return [];
  }, []);

  if (isLoading || isClaiming) {
    return <LinearProgress />;
  }

  if (error || errorClaiming) {
    console.log("error", error);
    console.log("errorClaiming", errorClaiming);
    return (
      <Alert severity="error">
        <AlertTitle>Ha ocurrido un error {typeof error}</AlertTitle>
      </Alert>
    );
  }

  if (!address) {
    return <div>no address</div>;
  }
  return (
    <Container>
      <Box my={10} textAlign="center">
        <Typography variant="h1">Virtual Airline</Typography>
        <ConnectWallet />
      </Box>

      <Box my={10}>
        <Grid container spacing={2}>
          {!!nft && (
            <Grid item xs={4}>
              <Card>
                <MediaRenderer width="100%" src={nft.metadata.image} />
                <CardHeader
                  title={nft.metadata.name}
                  subheader={nft.metadata.description}
                />
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Price</Typography>
                    <Typography variant="body2">0.01</Typography>
                  </Stack>
                  {nft.metadata.attributes &&
                    Array.isArray(nft.metadata.attributes) &&
                    nft.metadata.attributes.length > 0 && (
                      <>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>{nfts(nft)[0].trait_type}</Typography>
                          <Typography variant="body2">
                            {nfts(nft)[0].value}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>{nfts(nft)[1].trait_type}</Typography>
                          <Typography variant="body2">
                            {nfts(nft)[1].value}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>{nfts(nft)[2].trait_type}</Typography>
                          <Typography variant="body2">
                            {nfts(nft)[2].value}
                          </Typography>
                        </Stack>
                      </>
                    )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    disabled={isClaiming}
                    onClick={handleClick}
                  >
                    Claim C172
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
          {items.map((item) => (
            <Grid item xs={4} key={item.id}>
              <Card>
                <CardHeader title={item.name} subheader={item.description} />
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Price</Typography>
                    <Typography variant="body2">{item.price}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Capacity</Typography>
                    <Typography variant="body2">{item.capacity}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Deposit</Typography>
                    <Typography variant="body2">{item.deposit}</Typography>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button variant="contained">Comprar</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={4} p={2}>
          <Link href="/">
            <Typography variant="h4" paragraph>
              Home &rarr;
            </Typography>
          </Link>
          <Typography>Ir a la página principal</Typography>
        </Grid>
        <Grid item xs={4} p={2}>
          <Link href="/license">
            <Typography variant="h4" paragraph>
              Licencias &rarr;
            </Typography>
          </Link>
          <Typography>
            Grow, adquire a licence and start flying today.
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Link href="/gas">
            <Typography variant="h4" paragraph>
              Gas &rarr;
            </Typography>
          </Link>
          <Typography>
            Stake tokens and earn Gas to refuel your aircrafts.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Hangar;
