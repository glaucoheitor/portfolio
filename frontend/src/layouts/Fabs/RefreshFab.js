import Fab from "@mui/material/Fab";

import RefreshIcon from "@mui/icons-material/Refresh";

import { usePortfolioController, resetPrices } from "context";

function RefreshFab() {
  const [_, portfolioDispatch] = usePortfolioController();
  return (
    <Fab
      onClick={() => resetPrices(portfolioDispatch)}
      color="secondary"
      aria-label="refresh"
      sx={{
        position: "fixed",
        bottom: (theme) => theme.spacing(10),
        right: (theme) => theme.spacing(2),
      }}
    >
      <RefreshIcon fontSize="medium" />
    </Fab>
  );
}
export default RefreshFab;
