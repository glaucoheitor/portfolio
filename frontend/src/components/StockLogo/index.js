import MDBox from "components/MDBox";

const StockLogo = ({ symbol, width }) => {
  let imageSrc = require(`assets/images/logos/stocks/NO-LOGO.svg`);
  try {
    // Import image on demand
    const image = require(`assets/images/logos/stocks/${symbol.slice(
      0,
      4
    )}.svg`);

    // If the image doesn't exist. return noLogo
    if (image) imageSrc = image;
  } catch (e) {}
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
        height={40}
        maxWidth={width}
        src={imageSrc.default}
        alt={`${symbol} Logo`}
      />
    </MDBox>
  );
};

export default StockLogo;
