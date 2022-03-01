const inputBase = {
  styleOverrides: {
    input: {
      "&:-webkit-autofill": {
        transitionDelay: "9999s",
        transitionProperty: "background-color, color",
      },
    },
  },
};

export default inputBase;
