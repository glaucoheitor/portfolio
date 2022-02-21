/**
=========================================================
* Material Dashboard 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import StockLogo from "components/StockLogo";

function StockCard({
  color,
  title,
  currentPrice,
  priceChange,
  extraData,

  icon,
  logo,
  logoFallback,
  symbol,
  companyName,
}) {
  const [logoSrc, setLogoSrc] = useState(logo);
  const handleLogoOnError = () => setLogoSrc(logoFallback);
  return (
    <Card sx={{ minHeight: "12rem", justifyContent: "space-around" }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={1}
        px={2}
      >
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="7rem"
          height="4.5rem"
          mt={-3}
        >
          <StockLogo symbol={symbol} width="5rem" height="2.5rem" />
          <MDBox textAlign="center" width="5.5rem" py={0.5}>
            <MDTypography
              component="p"
              variant="button"
              color={color === "light" ? "dark" : "white"}
            >
              {symbol}
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="h4">{currentPrice}</MDTypography>
          <MDTypography variant="h6" color={priceChange.color}>
            {priceChange.amount}
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox textAlign="right" lineHeight={1.25} pt={1} px={2}>
        <MDTypography
          variant="button"
          //fontWeight="light"
          color="text"
          //textGradient
          sx={{
            visibility: "visible",
            display: "-webkit-box",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {companyName.toUpperCase()}
        </MDTypography>
      </MDBox>
      <Divider />
      {extraData &&
        extraData.map((data, i) => (
          <MDBox
            key={`stock-card-extra-data-${i}`}
            pb={2}
            px={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography
              component="p"
              variant="button"
              color="text"
              display="flex"
            >
              &nbsp;{data.label}
            </MDTypography>
            <MDTypography
              component="span"
              variant="button"
              fontWeight="bold"
              color={data.color}
            >
              {data.amount}
            </MDTypography>
          </MDBox>
        ))}
    </Card>
  );
}

// Setting default values for the props of StockCard
StockCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the StockCard
StockCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
    "text",
  ]),
  title: PropTypes.string.isRequired,
  currentPrice: PropTypes.node.isRequired,
  extraData: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "white",
      ]),
      amount: PropTypes.node,
      label: PropTypes.string,
    })
  ),
  icon: PropTypes.node.isRequired,
};

export default StockCard;
