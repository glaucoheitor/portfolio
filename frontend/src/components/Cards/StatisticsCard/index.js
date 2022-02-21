// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function StatisticsCard({ color, title, count, percentage, icon, extraData }) {
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {title}
          </MDTypography>
          {/* because this uses NumberFormat, the Typography component will be passed from DashboardPage */}
          {count}
        </MDBox>
      </MDBox>
      <Divider />
      {extraData &&
        extraData.map((data, i) => (
          <MDBox
            key={`statistics-extra-data-${i}`}
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

// Setting default values for the props of StatisticsCard
StatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the StatisticsCard
StatisticsCard.propTypes = {
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
  count: PropTypes.node.isRequired,
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

export default StatisticsCard;
