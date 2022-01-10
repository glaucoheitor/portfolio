import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

import TradesPage from "pages/TradesTest";
import Sidenav from "components/Sidenav";

// Material Dashboard 2 React themes
import lightTheme from "assets/theme";
import darkTheme from "assets/theme-dark";

// Material Dashboard 2 React contexts
import {
  PortfolioControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setDarkMode,
} from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

import routes from "routes";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useMemo(() => {
    if (prefersDarkMode) {
      setDarkMode(dispatch, true);
      return darkTheme;
    }
    setDarkMode(dispatch, false);
    return lightTheme;
  }, [prefersDarkMode]);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <PortfolioControllerProvider>
        <CssBaseline />
        {layout === "dashboard" && (
          <Sidenav
            color={sidenavColor}
            brand={
              (transparentSidenav && !darkMode) || whiteSidenav
                ? brandDark
                : brandWhite
            }
            brandName="Portfolio"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        )}
        <Routes>
          {getRoutes(routes)}
          <Route
            exact
            path="/trades/:symbol"
            element={<TradesPage />}
            key="trades-detail"
          />
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </PortfolioControllerProvider>
    </ThemeProvider>
  );
}
