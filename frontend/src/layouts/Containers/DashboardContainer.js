import { useState, useEffect } from "react";

// react-router-dom components
import { useLocation, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  usePortfolioController,
  setLayout,
  setTrades,
  setPortfolio,
  setPrices,
} from "context";

import {
  buildPortfolioFromTrades,
  getPrices,
  getTrades,
} from "services/portfolio.service";

function LayoutContainer({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const { miniSidenav } = controller;
  const { authData, trades, portfolio, prices } = portfolioController;
  const { pathname } = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    !authData.token && navigate("/auth/login", { replace: true });
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  useEffect(() => {
    console.log("trades");
    if (!trades) fetchData();

    async function fetchData() {
      try {
        const dataTrades = await getTrades(authData);
        setTrades(portfolioDispatch, dataTrades);
        setPortfolio(portfolioDispatch, buildPortfolioFromTrades(dataTrades));
      } catch (e) {
        //todo: show error message
      }
    }
  });

  useEffect(() => {
    const fetchPrices = async () => {
      if (portfolio) {
        for (const [symbolId, { symbol, totalQty }] of Object.entries(
          portfolio
        )) {
          if (totalQty > 0) {
            const data = await getPrices(symbol);
            console.log(data);
            setPrices(portfolioDispatch, { symbolId, prices: data });
          }
        }
        console.log(prices);
      }
    };
    console.log("fetchPrices");
    if (!Object.keys(prices).length) fetchPrices();
  }, [portfolio]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",

        [breakpoints.up("xl")]: {
          marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
          transition: transitions.create(["margin-left", "margin-right"], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </MDBox>
  );
}

// Typechecking props for the DashboardLayout
LayoutContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContainer;
