const inputFilled = {
  styleOverrides: {
    input: {
      "&:-webkit-autofill": {
        WebkitBoxShadow: "inherit",
        WebkitTextFillColor: "inherit",
        caretColor: "inherit",
      },
    },
  },
};

export default inputFilled;
