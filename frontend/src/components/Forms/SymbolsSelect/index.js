import { useState, useEffect } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

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
  const [value, setValue] = useState(null);
  const loading = open && symbols.length === 0;
  const navigate = useNavigate();

  const { authData } = portfolioController;

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

  return (
    <Autocomplete
      id="symbols"
      sx={{ width: "auto" }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      autoHighlight
      isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
      getOptionLabel={(s) => s.symbol}
      options={symbols}
      loading={loading}
      value={value}
      onChange={(event, newValue) => setValue(newValue)}
      renderInput={(params) => (
        <MDInput
          {...params}
          label="Symbol"
          InputProps={{
            ...params.InputProps,
            startAdornment: <CircularProgress color="inherit" size={20} />,
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
