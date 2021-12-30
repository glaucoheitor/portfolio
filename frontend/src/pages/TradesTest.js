import { useState, useRef, useEffect, useReducer } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";
import StockCard from "components/Cards/StockCard";

import {
  buildPortfolioFromTrades,
  getCurrentPrice,
} from "services/portfolio.service";

import NumberFormat from "utils/NumberFormat";

import { useMaterialUIController, login, setDarkMode } from "context";

function TradesTest() {
  const [controller, dispatch] = useMaterialUIController();
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState(null);

  const { authData, darkMode } = controller;

  //const [portfolio, portfolioDispatch] = useReducer(portfolioReducer, {});
  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <div>Hello!</div>
        </Grid>
      </MDBox>

      {/* trades && JSON.stringify(trades, null, 4) */}
    </LayoutContainer>
  );
}

export default TradesTest;
