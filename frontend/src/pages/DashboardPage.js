import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";

import StatisticsCard from "components/Cards/StatisticsCard";

import NumberFormat from "utils/NumberFormat";

import { useMaterialUIController, usePortfolioController } from "context";

function DashboardPage() {
  const [portfolioController] = usePortfolioController();
  const [changes, setChanges] = useState({});
  const [symbolId, setSymbolId] = useState(null);

  const { prices, totals } = portfolioController;

  const getColor = (amount) => {
    return !amount || amount === 0 ? "text" : amount > 0 ? "success" : "error";
  };

  useEffect(() => {
    //symbolId && prices[symbolId] && setHistorical(prices[symbolId].historical);
  }, [symbolId, prices]);

  useEffect(() => {
    if (totals) {
      const { investedTotal, currentTotal, previousTotal } = totals;
      const totalChange = currentTotal - investedTotal;
      const dailyChange = currentTotal - previousTotal;

      setChanges({
        total: totalChange,
        totalPercent: (totalChange / investedTotal) * 100,
        daily: dailyChange,
        dailyPercent: (dailyChange / previousTotal) * 100,
      });
    }
  }, [totals]);

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={4} xxxl={3} key="total">
            <MDBox mb={1.5}>
              <StatisticsCard
                icon="attach_money"
                title="Stocks Total"
                count={
                  <NumberFormat
                    RenderTextAs={MDTypography}
                    variant="h4"
                    value={totals?.currentTotal}
                    type={"$"}
                  />
                }
                extraData={[
                  {
                    color: getColor(changes?.total),
                    amount: <NumberFormat value={changes?.total} type={"$"} />,
                    label: "Resultado atual",
                  },
                ]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xxxl={3} key="change">
            <MDBox mb={1.5}>
              <StatisticsCard
                icon="show_chart"
                title="Variaçāo hoje"
                count={
                  <NumberFormat
                    RenderTextAs={MDTypography}
                    variant="h4"
                    color={getColor(changes?.daily)}
                    value={changes?.daily}
                    type="$"
                  />
                }
                extraData={[
                  {
                    color: getColor(changes?.dailyPercent),
                    amount: (
                      <NumberFormat value={changes?.dailyPercent} type={"%"} />
                    ),
                    label: "Rentabilidade",
                  },
                ]}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xxxl={3} key="ibov">
            <MDBox mb={1.5}>
              <StatisticsCard
                icon="account_balance"
                title="Ibovespa"
                count={
                  <NumberFormat
                    RenderTextAs={MDTypography}
                    variant="h4"
                    value={prices?.IBOV?.currentPrice}
                  />
                }
                extraData={[
                  {
                    color: getColor(prices?.IBOV?.priceChangePercent),
                    amount: (
                      <NumberFormat
                        value={prices?.IBOV?.priceChangePercent}
                        type={"%"}
                      />
                    ),
                    label: "Variaçāo hoje",
                  },
                ]}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default DashboardPage;
