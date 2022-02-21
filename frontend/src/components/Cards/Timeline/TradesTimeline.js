import format from "date-fns/format";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import TimelineItem from "./TimelineItem";

import NumberFormat from "utils/NumberFormat";

const getColor = (type) => {
  return type === "buy" ? "success" : "error";
};

const getIcon = (type) => {
  return type === "buy" ? "arrow_upward" : "arrow_downward";
};

function TradesTimeline({ trades }) {
  return (
    <Card sx={{ maxHeight: "45rem", overflow: "auto" }}>
      <MDBox pt={3} px={3} mb={2}>
        <MDTypography variant="h6" fontWeight="medium">
          Trades Timeline
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {trades
          .slice()
          .reverse()
          .map((trade, index, trades) => (
            <TimelineItem
              color={getColor(trade.type)}
              icon={getIcon(trade.type)}
              title={
                trade.price <= 0.01
                  ? `BONUS of ${trade.qty} shares`
                  : `${trade.type.toUpperCase()} ${trade.qty} shares for `
              }
              price={
                trade.price <= 0.01 ? null : (
                  <NumberFormat
                    RenderTextAs="none"
                    value={trade.price}
                    type="$"
                    extraSuffix=" ea"
                  />
                )
              }
              date={format(new Date(trade.date), "dd MMM yyyy")}
              lastItem={index === trades.length - 1 ? true : false}
            />
          ))}
      </MDBox>
    </Card>
  );
}

export default TradesTimeline;
