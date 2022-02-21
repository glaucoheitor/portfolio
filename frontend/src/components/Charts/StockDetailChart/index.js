import { useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-chartjs-2 components
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";

import { alpha } from "@mui/system";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Skeleton from "@mui/material/Skeleton";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// StockDetailChart configurations
import configs from "./configs";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

function StockDetailChart({ color, title, description, date, chart }) {
  const { data, options } = configs(chart?.labels || [], chart?.datasets || {});

  const StockDetailChart = useMemo(
    () => (
      <MDBox
        variant="gradient"
        bgColor={color}
        borderRadius="lg"
        coloredShadow={color}
        py={2}
        //pr={0.5}
        mt={-5}
        height="12.5rem"
      >
        <Line data={data} options={options} />
      </MDBox>
    ),
    [chart, color]
  );

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox padding="1rem">
        {chart ? (
          StockDetailChart
        ) : (
          <Skeleton
            sx={({ palette, borders }) => ({
              mt: -5,
              bgcolor: alpha(
                palette.gradients[color]?.main || palette.text.primary,
                0.65
              ),
              borderRadius: borders.borderRadius.lg,
            })}
            variant="rectangular"
            animation="wave"
            height="12.5rem"
          />
        )}

        <MDBox pt={3} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            {title}
          </MDTypography>
          <MDTypography
            component="div"
            variant="button"
            color="text"
            fontWeight="light"
          >
            {description}
          </MDTypography>
          <Divider />
          <MDBox display="flex" alignItems="center">
            <MDTypography
              variant="button"
              color="text"
              lineHeight={1}
              sx={{ mt: 0.15, mr: 0.5 }}
            >
              <Icon>schedule</Icon>
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="light">
              {date}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of StockDetailChart
StockDetailChart.defaultProps = {
  color: "dark",
  description: "",
};

// Typechecking props for the StockDetailChart
StockDetailChart.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  chart: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  ).isRequired,
};

export default StockDetailChart;
