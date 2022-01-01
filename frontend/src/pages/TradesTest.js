import { useState, useRef, useEffect, useReducer } from "react";

import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";

import {
  useMaterialUIController,
  usePortfolioController,
  setTrades,
  setPortfolio,
  setPrices,
} from "context";

function TradesTest() {
  const [controller, dispatch] = useMaterialUIController();
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [loading, setLoading] = useState(false);
  const [symbolId, setSymbolId] = useState(null);

  const { darkMode } = controller;
  const { authData, trades, portfolio, prices } = portfolioController;
  const { symbol } = useParams();

  useEffect(() => {
    const [sId, data] = Object.entries(portfolio).find(
      ([id, s]) => s.symbol === symbol
    );
    setSymbolId(sId);
    console.log(sId, data);
  }, [portfolio]);

  return (
    <LayoutContainer>
      {console.log(portfolio)}
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {portfolio && symbolId && <div>{prices[symbolId]}</div>}
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default TradesTest;
