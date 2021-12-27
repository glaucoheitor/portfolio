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

function ComplexStatisticsCard({
  color,
  title,
  count,
  percentage,
  icon,
  logo,
  logoFallback,
  symbolName,
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
          <MDBox
            component="img"
            src={logoSrc}
            alt="Brand"
            width="5.5rem"
            height="2.5rem"
            onError={handleLogoOnError}
          />
          <MDBox textAlign="center" width="5.5rem" py={0.5}>
            <MDTypography
              component="p"
              variant="button"
              color={color === "light" ? "dark" : "white"}
            >
              {symbolName}
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="h4">{count}</MDTypography>
        </MDBox>
      </MDBox>
      <MDBox textAlign="right" lineHeight={1.25} pt={1} px={2}>
        <MDTypography
          variant="button"
          //fontWeight="light"
          color="text"
          textGradient
          sx={{
            visibility: "visible",
            display: "-webkit-box",
            "-webkit-line-clamp": "1",
            "-webkit-box-orient": "vertical",
            overflow: "hidden",
          }}
        >
          {companyName}
        </MDTypography>
      </MDBox>
      <Divider />
      <MDBox pb={2} px={2}>
        <MDTypography
          component="p"
          variant="button"
          color="text"
          display="flex"
        >
          <MDTypography
            component="span"
            variant="button"
            fontWeight="bold"
            color={percentage.color}
          >
            {percentage.amount}
          </MDTypography>
          &nbsp;{percentage.label}
        </MDTypography>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
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
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node.isRequired,
};

export default ComplexStatisticsCard;
