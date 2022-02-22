import { useState, useEffect } from "react";

import { date, number, object, mixed } from "yup";

import NumberFormat from "react-number-format";

// date-fns
import DateAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
//import DatePicker from "@mui/lab/DatePicker";
import {
  subYears,
  isWeekend,
  subDays,
  endOfDay,
  parseISO,
  formatISO,
} from "date-fns";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDToggleButton from "components/MDToggleButton";
import SymbolsSelect from "components/Forms/SymbolsSelect";
import AddTradeBackdrop from "components/Backdrops/AddTradeBackdrop";

import SendIcon from "@mui/icons-material/Send";

import { Formik, Form, Field } from "formik";
import { ToggleButtonGroup } from "formik-mui";
import { DatePicker } from "formik-mui-lab";

import {
  usePortfolioController,
  setTrades,
  setPortfolio,
  setPrices,
} from "context";

import {
  buildPortfolioFromTrades,
  getTrades,
  getPrices,
} from "services/portfolio.service";

function AddTrade() {
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [submitStatus, setSubmitStatus] = useState(null);

  const { authData, prices } = portfolioController;

  const getMaxDate = () => {
    let date = parseISO(
      new Date().toLocaleDateString("sv-SE", {
        timeZone: "America/Sao_Paulo",
      })
    );

    while (isWeekend(date)) {
      date = subDays(date, 1);
    }

    return endOfDay(date);
  };

  const handleSubmit = async (
    { type, date, price, qty, symbol, ...props },
    actions
  ) => {
    const [year, month, day] = formatISO(date).substring(0, 10).split("-");

    const dateUTC = Date.UTC(year, month - 1, day);

    const requestBody = {
      query: `
      mutation {
        addTrade( tradeInput: {
          type: "${type}",
          symbolId: "${symbol._id}",
          qty: ${qty},
          price: ${price},
          total: ${price * qty},
          date: ${dateUTC}
        }) {
          _id
        }
      }`,
    };
    try {
      const { data, errors } = await fetch(
        process.env.REACT_APP_BACKEND + "/graphql",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authData?.token,
          },
        }
      ).then((res) => res.json());

      if (errors) throw new Error(errors[0]);
      setSubmitStatus("success");
      fetchTrades(symbol);
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  const fetchTrades = async (symbol) => {
    try {
      const dataTrades = await getTrades(authData);
      setTrades(portfolioDispatch, dataTrades);
      setPortfolio(portfolioDispatch, buildPortfolioFromTrades(dataTrades));
      if (!prices[symbol._id]) {
        const dataPrices = await getPrices(symbol.symbol);
        setPrices(portfolioDispatch, {
          symbolId: symbol._id,
          prices: dataPrices,
        });
      }
    } catch (e) {
      //todo: show error message
    }
  };

  const schema = object({
    date: date()
      .required("Select trade date.")
      .min(subYears(new Date(), 5), "Date can't be older than 5 years.")
      .max(getMaxDate(), "Date can't be in the future.")
      .typeError("Invalid date"),
    price: number()
      .required("Enter the price")
      .positive("Enter a price higher than 0.")
      .typeError("Invalid price"),
    qty: number()
      .required("Enter a quantity.")
      .positive("Enter a number higher than 0.")
      .integer("Enter a integer number.")
      .typeError("Invalid quantity"),
    symbol: mixed().required("Select a symbol."),
  });

  return (
    <MDBox p={3} width={300} sx={{ backgroundColor: "background.default" }}>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
          type: "buy",
          date: getMaxDate(),
          price: "",
          qty: "",
          symbol: "",
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          ...formik
        }) => (
          <Form>
            <AddTradeBackdrop
              status={isSubmitting ? "loading" : submitStatus}
              setSubmitStatus={setSubmitStatus}
            />

            <MDBox mb={3}>
              <Field
                component={ToggleButtonGroup}
                onChange={(e, newType) =>
                  newType !== null && setFieldValue("type", newType)
                }
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
            <MDBox mb={1}>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <Field
                  component={DatePicker}
                  label="Date"
                  name="date"
                  value={values.date}
                  minDate={subYears(new Date(), 5)}
                  maxDate={getMaxDate()}
                  shouldDisableDate={isWeekend}
                  allowSameDateSelection
                  error={touched.date && errors.date}
                  renderInput={(params) => {
                    return (
                      <MDInput
                        fullWidth
                        helperText={
                          touched.date && !!errors.date ? errors.date : " "
                        }
                        {...params}
                      />
                    );
                  }}
                />
              </LocalizationProvider>
            </MDBox>
            <MDBox mb={1}>
              <Field
                component={NumberFormat}
                customInput={MDInput}
                name="price"
                prefix="R$ "
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                //allowEmptyFormatting={true}
                label="Price"
                fullWidth
                value={values.price}
                error={touched.price && !!errors.price}
                disabled={isSubmitting}
                onValueChange={({ floatValue }, sourceInfo) => {
                  setFieldValue("price", floatValue);
                }}
                helperText={
                  touched.price && !!errors.price ? errors.price : " "
                }
                onBlur={() => setFieldTouched("price", true)}
              />
            </MDBox>
            <MDBox mb={1}>
              <Field
                as={MDInput}
                type="number"
                label="Quantity"
                name="qty"
                disabled={isSubmitting}
                error={touched.qty && !!errors.qty}
                fullWidth
                helperText={touched.qty && !!errors.qty ? errors.qty : " "}
              />
            </MDBox>
            <MDBox mb={1}>
              <Field name="symbol" component={SymbolsSelect} />
            </MDBox>
            <MDBox mt={2} mb={1}>
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
          </Form>
        )}
      </Formik>
    </MDBox>
  );
}

export default AddTrade;
