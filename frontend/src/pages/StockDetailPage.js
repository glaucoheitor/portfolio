import { useState, useEffect, useReducer } from "react";

import { useParams } from "react-router-dom";

import format from "date-fns/format";

// @mui material components
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";
import TradesTimeline from "components/Cards/Timeline/TradesTimeline";
import StockDetailChart from "components/Charts/StockDetailChart";
import StatisticsCard from "components/Cards/StatisticsCard";

import TimelineSkeleton from "components/Cards/Timeline/TimelineSkeleton";

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

function StockDetailPage() {
  const [controller, dispatch] = useMaterialUIController();
  const [portfolioController, portfolioDispatch] = usePortfolioController();

  const [symbolId, setSymbolId] = useState(null);
  const [symbolTrades, setSymbolTrades] = useState(null);
  const [historical, setHistorical] = useState(null);
  const [chartData, setChartData] = useState(null);

  const { darkMode } = controller;
  const { authData, trades, portfolio, prices } = portfolioController;
  const { symbol } = useParams();

  useEffect(() => {
    if (portfolio) {
      console.log(portfolio);
      const [sId, data] =
        Object.entries(portfolio).find(
          ([id, s]) => s.symbol === symbol.toUpperCase()
        ) || [];

      if (sId) {
        setSymbolId(sId);
        console.log(sId, data);
      } else {
        setSymbolTrades([]);
      }
    }
  }, [portfolio]);

  useEffect(() => {
    symbolId &&
      trades &&
      setSymbolTrades(trades.filter((trade) => trade.symbol._id === symbolId));
  }, [symbolId]);

  useEffect(() => {
    const getHistorical = async () => {
      setHistorical(
        await getHistoricalStockData(authData, symbol.toUpperCase())
      );
    };
    getHistorical();
  }, [symbol]);

  useEffect(() => {
    console.log(historical);
    historical &&
      //reduce historical array to object for the chart
      setChartData(
        historical.reduce(
          (obj, element) => {
            console.log(obj);
            obj.labels.push(format(new Date(element.date), "dd MMM"));
            obj.datasets.data.push(element.close);
            return obj;
          },
          {
            labels: [],
            datasets: { data: [] },
          }
        )
      );
  }, [historical]);

  return (
    <LayoutContainer>
      {console.log(historical)}
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item container xs={12} md={7} lg={8} xl={7}>
            <Grid item xs={12}>
              <MDBox mb={3} height={100}>
                Hello
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox mb={3}>
                <StockDetailChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={chartData}
                />
              </MDBox>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5} lg={4} xl={5}>
            {symbolTrades ? (
              <TradesTimeline trades={symbolTrades} />
            ) : (
              <TimelineSkeleton />
            )}
          </Grid>
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default StockDetailPage;
