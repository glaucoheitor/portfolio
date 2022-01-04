import { useState, useRef, useEffect, useReducer } from "react";

import { useParams } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import SymbolsSelect from "components/Forms/SymbolsSelect";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";

import { getAllSymbols } from "services/symbols.service";

import { useMaterialUIController, usePortfolioController } from "context";

function AddTrade() {
  const [controller, dispatch] = useMaterialUIController();
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [symbols, setSymbols] = useState([]);
  const [open, setOpen] = useState(false);
  const loading = open && symbols.length === 0;

  const { authData } = portfolioController;

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <SymbolsSelect />
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default AddTrade;
