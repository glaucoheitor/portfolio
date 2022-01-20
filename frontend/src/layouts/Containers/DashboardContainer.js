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
  setTotals,
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
  const navigate = useNavigate();

  const [loadedPrices, setLoadedPrices] = useState(false);

  useEffect(() => {
    !authData.token &&
      navigate("/auth/login", {
        state: { error: "UNAUTHENTICATED" },
        replace: true,
      });
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataTrades = await getTrades(authData);
        if (active) {
          setTrades(portfolioDispatch, dataTrades);
          setPortfolio(portfolioDispatch, buildPortfolioFromTrades(dataTrades));
        }
      } catch (e) {
        //todo: show error message
      }
    };

    let active = true;
    if (!trades) fetchData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      if (portfolio) {
        console.log(portfolio);
        setLoadedPrices(false);

        await Promise.all(
          Object.entries(portfolio).map(
            async ([symbolId, { symbol, totalQty }]) => {
              if (totalQty > 0) {
                try {
                  const data = await getPrices(symbol);
                  console.log(data);

                  active &&
                    setPrices(portfolioDispatch, { symbolId, prices: data });
                } catch (e) {
                  console.log(e);
                }
              }
            }
          )
        );

        setLoadedPrices(true);
      }
    };

    let active = true;
    if (!Object.keys(prices).length) fetchPrices();

    return () => {
      active = false;
    };
  }, [portfolio]);

  useEffect(() => {
    if (portfolio && loadedPrices) {
      const total = Object.entries(portfolio).reduce(
        (t, [symbolId, { total, totalQty }]) => ({
          currentTotal:
            t.currentTotal + prices[symbolId].currentPrice * totalQty,
          previousTotal:
            t.previousTotal + prices[symbolId].previousPrice * totalQty,
          investedTotal: t.investedTotal + total,
        }),
        { currentTotal: 0, previousTotal: 0, investedTotal: 0 }
      );
      setTotals(portfolioDispatch, total);
    }
  }, [loadedPrices, portfolio]);

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
