import { useState, useRef, useEffect, useReducer } from "react";

import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";

import {
  getPositionAtDay,
  getHistoricalStockData,
} from "services/portfolio.service";

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
  const [historical, setHistorical] = useState(null);

  const { darkMode } = controller;
  const { authData, trades, portfolio, prices } = portfolioController;
  const { symbol } = useParams();

  useEffect(() => {
    console.log(prices);
    if (portfolio) {
      const [sId, data] = Object.entries(portfolio).find(
        ([id, s]) => s.symbol === symbol
      );
      setSymbolId(sId);
      console.log(sId, data);
    }
  }, [portfolio]);

  useEffect(() => {
    symbolId && prices[symbolId] && setHistorical(prices[symbolId].historical);
  }, [symbolId, prices]);

  return (
    <LayoutContainer>
      {console.log(prices)}
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {historical && historical.quotes ? (
            <Table>
              <tbody>
                {console.log(historical)}
                {historical.quotes.map((h) => (
                  <tr key={h.date}>
                    <td>{new Date(h.date).toISOString()}</td>
                    <td>{h.close}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div>Loading...</div>
          )}
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default TradesTest;
