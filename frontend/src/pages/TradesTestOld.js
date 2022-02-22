import { useState, useRef, useEffect, useReducer } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";

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

  useEffect(() => {
    fetchData();

    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await fetch(
          process.env.REACT_APP_BACKEND + "/graphql",
          {
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
          }
        ).then((res) => res.json());

        setTrades(data.tradesByUserId);
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    }
  }, [trades]);

  //const [portfolio, portfolioDispatch] = useReducer(portfolioReducer, {});
  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {loading && <div>Loading...</div>}
          {trades && (
            <Table>
              {trades.map((trade) => (
                <tr>
                  <td>{trade.type === "C" ? "Compra" : "Venda"}</td>
                  <td>{new Date(trade.date).toISOString()}</td>
                  <td>{trade.symbol.symbol}</td>
                  <td>{trade.qty}</td>
                </tr>
              ))}
            </Table>
          )}
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default TradesTest;
