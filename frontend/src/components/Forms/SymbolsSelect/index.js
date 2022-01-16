import { useState, useEffect } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Popper from "@mui/material/Popper";

// Material Dashboard 2 React components
import MDInput from "components/MDInput";
import StockLogo from "components/StockLogo";

import ListboxComponent from "./ListboxComponent";
import { styled } from "@mui/material/styles";

import { getAllSymbols } from "services/symbols.service";

import { usePortfolioController } from "context";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

function SymbolsSelect({ tradeType }) {
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [symbols, setSymbols] = useState([]);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const loading = open && symbols.length === 0;
  const navigate = useNavigate();

  const { authData, portfolio } = portfolioController;

  useEffect(() => {
    let active = true;

    if (!loading) {
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
    if (tradeType === "buy") setOptions(symbols);
    if (tradeType === "sell") {
      setOptions(
        Object.entries(portfolio).map(([symbolId, value]) => ({
          _id: symbolId,
          symbol: value.symbol,
        }))
      );
    }
  }, [symbols, tradeType]);

  return (
    <>
      {console.log(value)}
      <Autocomplete
        id="symbols"
        sx={{ width: "auto" }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        autoHighlight
        disableListWrap
        isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
        getOptionLabel={(s) => s.symbol}
        options={options}
        loading={loading}
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        ListboxProps={{
          sx: { [`& .${autocompleteClasses.option}`]: { pl: 1 } },
        }}
        renderOption={(props, option) => ({
          props,
          option,
        })}
        renderInput={(params) => (
          <MDInput
            {...params}
            label="Symbol"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {value ? (
                    <StockLogo symbol={value.symbol} width={80} />
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
        )}
      />
    </>
  );
}

export default SymbolsSelect;
