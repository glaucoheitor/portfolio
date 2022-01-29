import { useState, useRef, useEffect, useReducer } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import Skeleton from "@mui/material/Skeleton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";

import StatisticsCard from "components/Cards/StatisticsCard";

import NumberFormat from "utils/NumberFormat";

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

function DashboardPage() {
  const [controller, dispatch] = useMaterialUIController();
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [loading, setLoading] = useState(false);
  const [symbolId, setSymbolId] = useState(null);
  const [historical, setHistorical] = useState(null);

  const { darkMode } = controller;
  const { authData, trades, portfolio, prices, totals } = portfolioController;

  const getColor = (amount) => {
    return !amount || amount === 0 ? "text" : amount > 0 ? "success" : "error";
  };

  useEffect(() => {
    //symbolId && prices[symbolId] && setHistorical(prices[symbolId].historical);
  }, [symbolId, prices]);

  let totalChange, totalChangePercent;

  if (totals) {
    console.log(totals);
    totalChange = totals.currentTotal - totals.previousTotal;
    totalChangePercent = (totalChange / totals.previousTotal) * 100;
  }

  const color =
    !totalChangePercent || totalChangePercent === 0
      ? "text"
      : totalChangePercent > 0
      ? "success"
      : "error";

  return (
    <LayoutContainer>
      {console.log(prices)}
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4} xxxl={3} key={symbolId}>
            <MDBox mb={1.5}>
              {totals ? (
                <StatisticsCard
                  icon="weekend"
                  title="Total"
                  count={
                    <NumberFormat value={totals.currentTotal} type={"$"} />
                  }
                  extraData={[
                    {
                      color: getColor(totalChangePercent),
                      amount: <NumberFormat value={totalChange} type={"$"} />,
                      label: "Variaçāo hoje",
                    },
                    {
                      color: getColor(totalChangePercent),
                      amount: (
                        <NumberFormat value={totalChangePercent} type={"%"} />
                      ),
                      label: "Rentabilidade",
                    },
                  ]}
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height="8.5rem"
                />
              )}
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xxxl={3} key={symbolId}>
            <MDBox mb={1.5}>
              {prices && prices.IBOV ? (
                <StatisticsCard
                  icon="weekend"
                  title="Ibovespa"
                  count={<NumberFormat value={prices.IBOV.currentPrice} />}
                  extraData={[
                    {
                      color: getColor(prices.IBOV.priceChangePercent),
                      amount: (
                        <NumberFormat
                          value={prices.IBOV.priceChangePercent}
                          type={"%"}
                        />
                      ),
                      label: "Variaçāo hoje",
                    },
                  ]}
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height="8.5rem"
                />
              )}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default DashboardPage;
