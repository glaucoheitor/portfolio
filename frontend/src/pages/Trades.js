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

function TradesPage() {
  const [controller, dispatch] = useMaterialUIController();
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState(null);

  const { authData, darkMode } = controller;

  const [portfolio, portfolioDispatch] = useReducer(portfolioReducer, {});

  function portfolioReducer(state, { type, value }) {
    switch (type) {
      case "set":
        return { ...value, currentPrices: false, previousPrices: false };
      case "currentPrice":
        return {
          ...state,
          currentPrices: true,
          [value.symbolId]: {
            ...state[value.symbolId],
            ...value.prices,
          },
        };
      default:
        throw new Error();
    }
  }

  useEffect(() => {
    if (!trades) fetchData();

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
                symbol {
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
  }, [trades]);

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      console.log("hey");
      for (const [
        symbolId,
        { symbol, totalQty, currentPrice, previousPrice },
      ] of Object.entries(portfolio)) {
        if (totalQty > 0 && currentPrice === null) {
          const data = await getCurrentPrice(symbol);
          console.log(data);
          portfolioDispatch({
            type: "currentPrice",
            value: { symbolId, prices: data },
          });
        }
      }
    };

    if (!portfolio.currentPrices) fetchCurrentPrices();
  }, [portfolio.currentPrices]);

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
    ([
      symbolId,
      {
        symbol,
        companyName,
        total,
        totalQty,
        precoMedio,
        currentPrice,
        regularMarketPreviousClose,
        priceChangePercent,
      },
    ]) => {
      if (totalQty > 0) {
        const result =
          currentPrice && !isNaN(currentPrice)
            ? totalQty * currentPrice - totalQty * precoMedio
            : null;
        return (
          <Grid item xs={12} sm={6} lg={4} xxxl={3}>
            <MDBox mb={1.5}>
              <StockCard
                color={darkMode ? "dark" : "light"}
                icon="weekend"
                title={symbol}
                symbol={symbol}
                companyName={companyName}
                priceChange={{
                  color:
                    !priceChangePercent || priceChangePercent === 0
                      ? "text"
                      : priceChangePercent > 0
                      ? "success"
                      : "error",
                  amount:
                    !priceChangePercent && priceChangePercent !== 0 ? (
                      ""
                    ) : typeof priceChangePercent !== "number" ? (
                      priceChangePercent
                    ) : (
                      <NumberFormat value={priceChangePercent} type={"%"} />
                    ),
                }}
                currentPrice={
                  currentPrice ? (
                    isNaN(currentPrice) ? (
                      currentPrice
                    ) : (
                      <NumberFormat value={currentPrice} type={"$"} />
                    )
                  ) : (
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="8rem"
                      height="4rem"
                    />
                  )
                }
                logo={`https://cdn.toroinvestimentos.com.br/corretora/images/quote/${symbol.slice(
                  0,
                  4
                )}.svg`}
                logoFallback="https://cdn.toroinvestimentos.com.br/corretora/images/quote/NO-LOGO.svg"
                extraData={[
                  {
                    color: "text",
                    amount: totalQty,
                    label: "Quantidade",
                  },
                  {
                    color:
                      !result || result === 0
                        ? "text"
                        : result > 0
                        ? "success"
                        : "error",
                    amount: result ? (
                      <NumberFormat value={result} type={"$"} />
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        width={75}
                        height={21}
                      />
                    ),
                    label: "Resultado atual",
                  },
                  {
                    color: "text",
                    amount: <NumberFormat value={total} type={"$"} />,
                    label: "Valor atual investido",
                  },
                ]}
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
          {Object.keys(portfolio).length !== 0 && <>{renderStockCards}</>}
        </Grid>
      </MDBox>

      {/* trades && JSON.stringify(trades, null, 4) */}
    </LayoutContainer>
  );
}

export default TradesPage;
