import MDBox from "components/MDBox";

const StockLogo = ({ symbol, height = 40, width, maxWidth }) => {
  let image = require(`assets/images/logos/stocks/NO-LOGO.svg`);
  try {
    // Import image on demand
    image = require(`assets/images/logos/stocks/${symbol.slice(0, 4)}.svg`);
  } catch {
    try {
      image = require(`assets/images/logos/stocks/${symbol.slice(0, 4)}.png`);
    } catch {}
  }

  return (
    <MDBox
      width={width}
      mr={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <MDBox
        component="img"
        loading="lazy"
        height={height}
        maxWidth={maxWidth ? maxWidth : width}
        src={image}
        alt={`${symbol} Logo`}
      />
    </MDBox>
  );
};

export default StockLogo;
