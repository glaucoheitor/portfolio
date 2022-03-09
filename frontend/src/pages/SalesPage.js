import { memo } from "react";
import { format } from "date-fns";

// @mui material components
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";

import NumberFormat from "utils/NumberFormat";

import { usePortfolioController } from "context";

const SalesPage = () => {
  const [portfolioController] = usePortfolioController();

  const { sales } = portfolioController;
  return <Sales sales={sales} />;
};

const Sales = memo(({ sales }) => {
  if (sales) {
    const salesByMonth = sales.reduce((obj, sale) => {
      const month = format(new Date(sale.date), "yyyy-MM");
      !obj[month] ? (obj[month] = [sale]) : obj[month].push(sale);
      return obj;
    }, {});
    console.log(salesByMonth);
  }

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <MDTypography>Accordion 1</MDTypography>
              </AccordionSummary>
              <AccordionDetails>
                <MDTypography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </MDTypography>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            {sales && (
              <Table>
                <tbody>
                  {sales.map(({ symbol, date, qty, price, result }, index) => (
                    <tr key={`${symbol._id}-${index}`}>
                      <td>{new Date(date).toUTCString().substring(0, 16)}</td>
                      <td>{symbol.symbol}</td>
                      <td>{qty}</td>
                      <td>{price}</td>
                      <td>
                        <NumberFormat value={result} type={"$"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Grid>
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
});

export default SalesPage;
