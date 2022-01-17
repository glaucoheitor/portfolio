import { useState, useRef, useEffect, useReducer, StrictMode } from "react";

import { useParams } from "react-router-dom";

import { date, number, object } from "yup";

import NumberFormat from "react-number-format";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
//import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputAdornment from "@mui/material/InputAdornment";

// date-fns
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { subYears, isWeekend } from "date-fns";

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

import { Formik, Form, Field, FieldProps } from "formik";
import { ToggleButtonGroup, fieldToTextField } from "formik-mui";

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
  const [state, dispatch] = useReducer(reducer, {
    type: "buy",
    date: new Date(),
    price: 0,
  });
  const [error, errorDispatch] = useReducer(errorReducer, {});
  const [loading, setLoading] = useState(false);

  const { darkMode } = controller;
  const { authData } = portfolioController;

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  const schema = object({
    date: date().required().min(new Date()).max(new Date("2100-10-10")),
    price: number().required().positive(),
    qty: number().required().positive().integer(),
  });

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <MDBox pt={4} pb={3} px={3} width={300}>
            <Formik
              validationSchema={schema}
              onSubmit={(values) => {
                alert(JSON.stringify(values, null, 2));
              }}
              initialValues={{
                type: "buy",
                date: new Date(),
                //price: 0,
                qty: "",
              }}
            >
              {({
                values,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
                ...formik
              }) => (
                <Form>
                  <MDBox mb={2}>
                    <Field
                      component={ToggleButtonGroup}
                      fullWidth
                      name="type"
                      type="checkbox"
                      exclusive
                    >
                      <MDToggleButton color="success" value="buy">
                        BUY
                      </MDToggleButton>
                      <MDToggleButton color="error" value="sell">
                        SELL
                      </MDToggleButton>
                    </Field>
                  </MDBox>
                  <MDBox mb={2}>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DatePicker
                        label="Date"
                        value={state.date}
                        minDate={subYears(new Date(), 5)}
                        maxDate={new Date()}
                        shouldDisableDate={isWeekend}
                        allowSameDateSelection
                        error={error.date}
                        onChange={(date) => {
                          dispatch({ type: "date", value: date });
                        }}
                        renderInput={(params) => {
                          return <MDInput fullWidth {...params} />;
                        }}
                      />
                    </LocalizationProvider>
                  </MDBox>
                  <MDBox mb={2}>
                    <Field
                      name="price"
                      component={NumberFormat}
                      customInput={MDInput}
                      prefix="R$ "
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      allowEmptyFormatting={true}
                      label="Price"
                      fullWidth
                      value={values.price}
                      error={touched["price"] && !!errors["price"]}
                      disabled={loading}
                      onValueChange={({ floatValue }, sourceInfo) => {
                        setFieldValue("price", floatValue);
                        console.log(sourceInfo);
                      }}
                      //onBlur={formik.handleBlur}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <Field
                      as={MDInput}
                      type="number"
                      label="Quantity"
                      name="qty"
                      fullWidth
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <StrictMode>
                      <SymbolsSelect tradeType={state.type} />
                    </StrictMode>
                  </MDBox>
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color="info"
                      fullWidth
                      isLoadingButton
                      loading={isSubmitting}
                      endIcon={<SendIcon />}
                    >
                      Submit
                    </MDButton>
                  </MDBox>
                  <MDAlert
                    color="error"
                    dismissible
                    open={Object.keys(error).length > 0 ? true : false}
                    handleAlertCloseButton={() =>
                      errorDispatch({ type: "reset" })
                    }
                  >
                    {Object.values(error)}
                  </MDAlert>
                  <Grid item xs={12} sm={12} style={{ margin: "24px" }}>
                    <pre>
                      <code>{JSON.stringify({ errors, values }, null, 2)}</code>
                    </pre>
                  </Grid>
                </Form>
              )}
            </Formik>
          </MDBox>
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default AddTrade;
