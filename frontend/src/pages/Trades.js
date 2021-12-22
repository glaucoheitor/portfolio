import { useState, useRef, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";
import StockCard from "components/Cards/StockCard";

import { buildPortfolioFromTrades } from "services/portfolio.service";

import { useMaterialUIController, login } from "context";

function TradesPage() {
  const [controller, dispatch] = useMaterialUIController();
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState(null);
  const [portfolio, setPortifolio] = useState({});

  useEffect(() => {
    const { authData } = controller;
    setLoading(true);
    fetchData();
    setLoading(false);

    async function fetchData() {
      try {
        const { data } = await fetch("http://localhost:3001/graphql", {
          method: "POST",
          body: JSON.stringify({
            query: `query {
              tradesByUserId(userId:"${authData.userId}") {
                type
                date
                qty
                price
                symbol{
                  _id
                  symbol
                }
              }
            }`,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authData.token,
          },
        }).then((res) => res.json());

        setTrades(data.tradesByUserId);
      } catch (e) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!trades) return;
    setPortifolio(buildPortfolioFromTrades(trades));
  }, [trades]);

  const renderStockCards = Object.entries(portfolio).map(
    ([symbolId, { symbolName, total, totalQty }]) => {
      if (totalQty > 0) {
        return (
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StockCard
                color="dark"
                icon="weekend"
                title={symbolName}
                symbolName={symbolName}
                count={total.toFixed(2)}
                logo={`https://cdn.toroinvestimentos.com.br/corretora/images/quote/${symbolName.slice(
                  0,
                  4
                )}.svg`}
                logoFallback="https://cdn.toroinvestimentos.com.br/corretora/images/quote/NO-LOGO.svg"
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
        );
      }
    }
  );

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {portfolio && renderStockCards}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StockCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StockCard
                icon="leaderboard"
                title="Today's Users"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StockCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <StockCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

      {loading && "Loading"}
      {/* trades && JSON.stringify(trades, null, 4) */}
    </LayoutContainer>
  );
}

export default TradesPage;
