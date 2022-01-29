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

function TradesPage() {
  const [controller, dispatch] = useMaterialUIController();
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [loading, setLoading] = useState(false);

  const { darkMode } = controller;
  const { authData, trades, portfolio, prices } = portfolioController;

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {trades && (
              <Table>
                <tbody>
                  {trades.map((trade, index) => (
                    <tr key={`${trade.symbol._id}-${index}`}>
                      <td>
                        {new Date(trade.date).toUTCString().substring(0, 16)}
                      </td>
                      <td>{trade.symbol.symbol}</td>
                      <td>{trade.type.toUpperCase()}</td>
                      <td>{trade.qty}</td>
                      <td>{trade.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default TradesPage;
