import { useState, useEffect } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { Autocomplete } from "formik-mui";
import CircularProgress from "@mui/material/CircularProgress";
import Popper from "@mui/material/Popper";

// Material Dashboard 2 React components
import MDInput from "components/MDInput";
import StockLogo from "components/StockLogo";

import ListboxComponent from "./ListboxComponent";
import { styled } from "@mui/material/styles";

import { getAllSymbols } from "services/symbols.service";

import { usePortfolioController } from "context";
import { handleBreakpoints } from "@mui/system";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

function SymbolsSelect(props) {
  const { field, form } = props;
  const { values, touched, errors, setFieldValue } = form;
  const { type: tradeType } = values;

  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [symbols, setSymbols] = useState([]);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [shrinkLabel, setShrinkLabel] = useState(false);
  const loading = open && options.length === 0;
  const navigate = useNavigate();

  const { authData, portfolio } = portfolioController;

  useEffect(() => {
    let active = true;

    if (!loading || tradeType === "sell") {
      return undefined;
    }
    //ugly, look for a better solution in the future
    (async () => {
      const data = await getAllSymbols(authData);
      if (data.error && data.error == "UNAUTHENTICATED")
        navigate("/auth/login", {
          state: { error: data.error },
          replace: true,
        });
      if (active && data.symbols) setSymbols(data.symbols);
    })();
    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    setFieldValue("symbol", null, false);
    if (tradeType === "buy") setOptions(symbols);

    if (tradeType === "sell")
      setOptions(
        Object.entries(portfolio).map(([symbolId, value]) => ({
          _id: symbolId,
          symbol: value.symbol,
        }))
      );
  }, [symbols, tradeType]);

  const handleShrinkLabel = (event) => {
    const { onFocus } = field;
    setShrinkLabel(true);
    onFocus && onFocus(event); // let the child do it's thing
  };

  const handleUnshrinkLabel = (event) => {
    const { onBlur } = field;
    if (event.target.value.length === 0) {
      setShrinkLabel(false); //gotta make sure the input is empty before shrinking the label
    }
    onBlur && onBlur(event); // let the child do it's thing
  };
  return (
    <Autocomplete
      {...props}
      id="symbol"
      sx={{
        width: "auto",
        [`& .${autocompleteClasses.inputRoot}`]: { p: "12px" },
        [`& .MuiOutlinedInput-root .MuiAutocomplete-input`]: {
          p: 0,
        },
      }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      autoHighlight
      disableListWrap
      isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
      getOptionLabel={(s) => s.symbol ?? ""}
      options={options}
      loading={loading}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      ListboxProps={{
        sx: { [`& .${autocompleteClasses.option}`]: { pl: 2 } },
      }}
      renderOption={(props, option) => ({
        props,
        option,
      })}
      renderInput={(params) => {
        return (
          <MDInput
            {...params}
            label="Symbol"
            name="symbol"
            error={touched.symbol && !!errors.symbol && !open}
            helperText={touched.symbol && !!errors.symbol ? errors.symbol : " "}
            InputLabelProps={{ shrink: shrinkLabel }}
            InputProps={{
              ...params.InputProps,
              onFocus: handleShrinkLabel,
              onBlur: handleUnshrinkLabel,
              startAdornment: (
                <>
                  {field.value ? (
                    <StockLogo
                      symbol={field.value.symbol}
                      maxWidth={100}
                      width={"auto"}
                      height={20}
                    />
                  ) : null}
                </>
              ),

              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        );
      }}
    />
  );
}

export default SymbolsSelect;
