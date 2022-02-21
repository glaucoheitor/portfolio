import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Fab from "@mui/material/Fab";
import Popover from "@mui/material/Popover";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

//icons
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

// react-router-dom components
import { Link } from "react-router-dom";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";
import StockCard from "components/Cards/StockCard";
import AddTrade from "./AddTrade";

import NumberFormat from "utils/NumberFormat";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  usePortfolioController,
  resetPrices,
} from "context";

function StocksPage() {
  const [controller] = useMaterialUIController();
  const [portfolioController, portfolioDispatch] = usePortfolioController();

  const { darkMode } = controller;
  const { portfolio, prices } = portfolioController;

  const [anchorEl, setAnchorEl] = useState(null);
  const [parentAnchorEl, setparentAnchorEl] = useState(null);

  const handleAddClick = (event) => {
    setparentAnchorEl(event.currentTarget.parentNode);
    setAnchorEl(event.currentTarget);
  };

  const handleRefreshClick = () => {
    resetPrices(portfolioDispatch);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //create an array with 15 Skeletons
  const renderSkeleton = () =>
    Array.from({ length: 15 }, (_, index) => (
      <Grid item xs={12} sm={6} lg={4} xxxl={3} key={index}>
        <MDBox mb={1.5}>
          <Skeleton variant="rectangular" animation="wave" height="8.5rem" />
        </MDBox>
      </Grid>
    ));

  const renderStockCards = () =>
    portfolio &&
    Object.entries(portfolio).map(
      ([symbolId, { symbol, companyName, total, totalQty, precoMedio }]) => {
        if (totalQty > 0) {
          const { [symbolId]: symbolPrices } = prices || {};

          const { currentPrice, priceChangePercent } = symbolPrices || {};

          const result =
            currentPrice && !isNaN(currentPrice)
              ? totalQty * currentPrice - totalQty * precoMedio
              : null;
          return (
            <Grid item xs={12} sm={6} lg={4} xxxl={3} key={symbolId}>
              <MDBox mb={1.5}>
                <Link to={`/stocks/${symbol}`}>
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
                      amount: (
                        <NumberFormat value={priceChangePercent} type={"%"} />
                      ),
                    }}
                    currentPrice={
                      <NumberFormat value={currentPrice} type={"$"} />
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
                        amount: <NumberFormat value={result} type={"$"} />,
                        label: "Resultado atual",
                      },
                      {
                        color: "text",
                        amount: <NumberFormat value={total} type={"$"} />,
                        label: "Valor investido",
                      },
                    ]}
                  />
                </Link>
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
          {portfolio ? <>{renderStockCards()}</> : renderSkeleton()}
          <Fab
            onClick={handleAddClick}
            sx={{
              position: "fixed",
              bottom: (theme) => theme.spacing(2),
              right: (theme) => theme.spacing(2),
            }}
            color="primary"
          >
            <AddIcon fontSize="medium" />
          </Fab>
          <Fab
            onClick={handleRefreshClick}
            color="secondary"
            aria-label="refresh"
            sx={{
              position: "fixed",
              bottom: (theme) => theme.spacing(10),
              right: (theme) => theme.spacing(2),
            }}
          >
            <RefreshIcon fontSize="medium" />
          </Fab>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            container={parentAnchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            PaperProps={{ sx: { backgroundColor: "background.default" } }}
          >
            <MDBox
              display="block"
              position="absolute"
              top={0}
              right={0}
              p={1.625}
              onClick={handleClose}
              sx={{ cursor: "pointer" }}
            >
              <MDTypography variant="h6" color="secondary">
                <Icon sx={{ fontWeight: "bold" }}>close</Icon>
              </MDTypography>
            </MDBox>
            <AddTrade />
          </Popover>
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default StocksPage;
