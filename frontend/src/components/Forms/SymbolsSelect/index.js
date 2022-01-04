import { useState, useEffect } from "react";

// @mui material components
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDInput from "components/MDInput";

import { getAllSymbols } from "services/symbols.service";

import { usePortfolioController } from "context";

function SymbolsSelect() {
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [symbols, setSymbols] = useState([]);
  const [open, setOpen] = useState(false);
  const loading = open && symbols.length === 0;

  const { authData } = portfolioController;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    //ugly, look for a better solution in the future
    (async () => {
      const allSymbols = await getAllSymbols(authData);
      if (active) setSymbols(allSymbols);
    })();
    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <Autocomplete
      id="symbols"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
      getOptionLabel={(s) => s.symbol}
      options={symbols}
      loading={loading}
      renderInput={(params) => (
        <MDInput
          {...params}
          label="Symbol"
          InputProps={{
            ...params.InputProps,
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
  );
}

export default SymbolsSelect;
