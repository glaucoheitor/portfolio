import { createContext, useContext, useReducer } from "react";
import TokenService from "../services/token.service";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// The Soft UI Dashboard PRO Material main context
const Portfolio = createContext();

// Setting custom name for the context which is visible on react dev tools
Portfolio.displayName = "PortfolioContext";

// Portfolio reducer
function portfolioReducer(state, { type, value }) {
  switch (type) {
    case "TRADES":
      return { ...state, trades: value };
    case "PORTFOLIO":
      return { ...state, portfolio: value };
    case "TOTALS":
      return { ...state, totals: value };
    case "PRICES":
      return {
        ...state,
        prices: {
          ...state.prices,
          [value.symbolId]: {
            ...state.prices[value.symbolId],
            ...value.prices,
          },
        },
      };
    case "LOADED_PRICES": {
      return { ...state, loadedPrices: value };
    }
    case "RESET_PRICES": {
      return { ...state, loadedPrices: false, prices: {} };
    }
    case "LOGIN": {
      return {
        ...state,
        authData: value,
      };
    }
    case "LOGOUT": {
      return {
        trades: null,
        portfolio: null,
        totals: null,
        prices: {},
        authData: null,
      };
    }
    default:
      throw new Error();
  }
}

// Portfolio context provider
function PortfolioControllerProvider({ children }) {
  const initialState = {
    trades: null,
    portfolio: null,
    prices: {},
    authData: null,
    loadedPrices: false,
  };

  const [controller, dispatch] = useReducer(portfolioReducer, initialState);

  return (
    <Portfolio.Provider value={[controller, dispatch]}>
      {children}
    </Portfolio.Provider>
  );
}

// custom hook for using context
function usePortfolioController() {
  const context = useContext(Portfolio);

  if (!context) {
    throw new Error(
      "usePortfolioController should be used inside the PortfolioControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the PortfolioControllerProvider
PortfolioControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setTrades = (dispatch, value) => dispatch({ type: "TRADES", value });
const setPortfolio = (dispatch, value) =>
  dispatch({ type: "PORTFOLIO", value });
const setTotals = (dispatch, value) => dispatch({ type: "TOTALS", value });
const setPrices = (dispatch, value) => dispatch({ type: "PRICES", value });
const setLoadedPrices = (dispatch, value) =>
  dispatch({ type: "LOADED_PRICES", value });
const resetPrices = (dispatch) => dispatch({ type: "RESET_PRICES" });
const login = (dispatch, value) => dispatch({ type: "LOGIN", value });
const logout = (dispatch) => dispatch({ type: "LOGOUT" });

export {
  PortfolioControllerProvider,
  usePortfolioController,
  setTrades,
  setPortfolio,
  setPrices,
  setLoadedPrices,
  resetPrices,
  setTotals,
  login,
  logout,
};
