// @mui material components
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const TimelineSkeleton = () => (
  <Card sx={{ maxHeight: "45rem", overflow: "auto" }}>
    <MDBox pt={3} px={3} mb={2}>
      <MDTypography variant="h6" fontWeight="medium">
        Trades Timeline
      </MDTypography>
    </MDBox>
    <MDBox p={2}>
      {[...Array(9)].map((e, i) => (
        <MDBox position="relative" mb={3}>
          <MDBox position="absolute" top="8%" left="2px">
            <Skeleton
              animation="wave"
              variant="circular"
              width="2rem"
              height="2rem"
            />
          </MDBox>
          <MDBox ml={5.75} pt={0.5} lineHeight={0} maxWidth="12.5rem">
            <MDTypography variant="button" fontWeight="medium">
              <Skeleton />
            </MDTypography>
            <MDBox mt={0.5}>
              <MDTypography variant="caption">
                <Skeleton />
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      ))}
    </MDBox>
  </Card>
);

export default TimelineSkeleton;
