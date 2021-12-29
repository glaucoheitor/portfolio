import { useState, useRef, useEffect, useReducer } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";
import StockCard from "components/Cards/StockCard";

import { buildPortfolioFromTrades } from "services/portfolio.service";

import NumberFormat from "utils/NumberFormat";

import { useMaterialUIController, login, setDarkMode } from "context";

function TradesPage() {
  const [controller, dispatch] = useMaterialUIController();
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState(null);

  const { authData, darkMode } = controller;

  const [portfolio, portfolioDispatch] = useReducer(portfolioReducer, {});

  function portfolioReducer(state, action) {
    switch (action.type) {
      case "set":
        return action.value;
      case "decrement":
        return { count: state.count - 1 };
      default:
        throw new Error();
    }
  }

  useEffect(() => {
    fetchData();

    async function fetchData() {
      setLoading(true);
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
                  companyName {
                    longName
                    shortName
                  }
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

        portfolioDispatch({
          type: "set",
          value: buildPortfolioFromTrades(data.tradesByUserId),
        });
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    }
  }, []);

  const renderSkeleton = () => {
    let array = [];
    for (let i = 0; i <= 15; i++) {
      array.push(
        <Grid item xs={12} sm={6} lg={4} xxxl={3}>
          <MDBox mb={1.5}>
            <Skeleton variant="rectangular" animation="wave" height="8.5rem" />
          </MDBox>
        </Grid>
      );
    }
    return array;
  };

  const renderStockCards = Object.entries(portfolio).map(
    ([symbolId, { symbolName, companyName, total, totalQty }]) => {
      if (totalQty > 0) {
        return (
          <Grid item xs={12} sm={6} lg={4} xxxl={3}>
            <MDBox mb={1.5}>
              <StockCard
                color={darkMode ? "dark" : "light"}
                icon="weekend"
                title={symbolName}
                symbolName={symbolName}
                companyName={companyName}
                count={
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    width="8rem"
                  />
                }
                logo={`https://cdn.toroinvestimentos.com.br/corretora/images/quote/${symbolName.slice(
                  0,
                  4
                )}.svg`}
                logoFallback="https://cdn.toroinvestimentos.com.br/corretora/images/quote/NO-LOGO.svg"
                percentage={{
                  color: "success",
                  amount: <NumberFormat value={total} type={"$"} />,
                  label: "investido",
                }}
              />
            </MDBox>
          </Grid>
        );
      } else {
        return null;
      }
    }
  );

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {loading && renderSkeleton()}
          {console.log(portfolio)}
          {Object.keys(portfolio).length !== 0 && (
            <>
              {renderStockCards}
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
            </>
          )}
        </Grid>
      </MDBox>

      {/* trades && JSON.stringify(trades, null, 4) */}
    </LayoutContainer>
  );
}

export default TradesPage;
