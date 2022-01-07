import { useState, useRef, useEffect, useReducer } from "react";

import { useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// date-fns
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDToggleButton from "components/MDToggleButton";
import MDAlert from "components/MDAlert";
import SymbolsSelect from "components/Forms/SymbolsSelect";

import SendIcon from "@mui/icons-material/Send";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";

import { getAllSymbols } from "services/symbols.service";

import { useMaterialUIController, usePortfolioController } from "context";

const errorReducer = (state, { type, value }) => {
  if (type === "reset") return {};
  else
    return {
      ...state,
      [type]: value,
    };
};

const reducer = (state, { type, value }) => {
  console.log(type, value);
  if (type === "reset") return {};
  else
    return {
      ...state,
      [type]: value,
    };
};

function AddTrade() {
  const [controller] = useMaterialUIController();
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [state, dispatch] = useReducer(reducer, { type: "buy" });
  const [error, errorDispatch] = useReducer(errorReducer, {});
  const [loading, setLoading] = useState(false);

  const { authData } = portfolioController;

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox
              width={300}
              component="form"
              role="form"
              onSubmit={submitHandler}
            >
              <MDBox mb={2}>
                {console.log(state)}
                <ToggleButtonGroup
                  value={state.type}
                  exclusive
                  sx={{ display: "flex", justifyContent: "center" }}
                  justifyContent="center"
                  onChange={(e, type) =>
                    dispatch({ type: "type", value: type })
                  }
                >
                  <MDToggleButton color="success" value="buy">
                    BUY
                  </MDToggleButton>
                  <MDToggleButton color="error" value="sell">
                    SELL
                  </MDToggleButton>
                </ToggleButtonGroup>
              </MDBox>
              <MDBox mb={2}>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DatePicker
                    label="Date"
                    value={state.date}
                    onChange={(date) => {
                      dispatch({ type: "date", value: date });
                    }}
                    renderInput={(params) => <MDInput fullWidth {...params} />}
                  />
                </LocalizationProvider>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="price"
                  label="Price"
                  //inputRef={}
                  fullWidth
                  error={error.price}
                  disabled={loading}
                  onChange={() =>
                    errorDispatch({ type: "price", value: false })
                  }
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="qty"
                  label="Quantity"
                  //inputRef={}
                  fullWidth
                  error={error.qty}
                  disabled={loading}
                  onChange={() => errorDispatch({ type: "qty", value: false })}
                />
              </MDBox>
              <MDBox mb={2}>
                <SymbolsSelect />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  isLoadingButton
                  loading={loading}
                  endIcon={<SendIcon />}
                >
                  Submit
                </MDButton>
              </MDBox>
              <MDAlert
                color="error"
                dismissible
                open={Object.keys(error).length > 0 ? true : false}
                handleAlertCloseButton={() => errorDispatch({ type: "reset" })}
              >
                {Object.values(error)}
              </MDAlert>
            </MDBox>
          </MDBox>
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default AddTrade;
