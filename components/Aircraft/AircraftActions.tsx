import {
  CardActions,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const AircraftActions: React.FC<{
  // eslint-disable-next-line no-unused-vars
  onClaim: (id: string) => void;
  isClaiming: boolean;
  hasAircraft: boolean;
  hasLicense?: boolean;
  name?: string;
  id: string;
}> = ({ onClaim, isClaiming, hasLicense, hasAircraft, name, id }) => {
  const router = useRouter();

  const handleClick = useCallback(
    () => (hasLicense ? onClaim(id) : router.push("/license")),
    [hasLicense, router, onClaim, id]
  );

  if (hasAircraft) return null;
  return (
    <CardActions sx={{ px: 2 }}>
      {isClaiming && <LinearProgress />}
      <Button
        size="small"
        disabled={isClaiming}
        variant="contained"
        onClick={handleClick}
      >
        {isClaiming ? (
          <CircularProgress size={14} />
        ) : hasLicense ? (
          `Claim ${name}`
        ) : (
          "Require licencia"
        )}
      </Button>
    </CardActions>
  );
};

export default React.memo(AircraftActions);
