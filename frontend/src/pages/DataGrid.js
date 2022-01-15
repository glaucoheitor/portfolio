import { useState, useRef, useEffect, useReducer } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import LayoutContainer from "layouts/Containers/DashboardContainer";
import DashboardNavbar from "layouts/Navbars/DashboardNavbar";

function formatter({ formattedValue }) {
  return formattedValue ? (
    <Tooltip
      title={
        formattedValue.airportData
          ? `${formattedValue.airportData.city}, ${formattedValue.airportData.country}`
          : ""
      }
    >
      <span>{formattedValue.destination}</span>
    </Tooltip>
  ) : (
    ""
  );
}

function DataGridPage() {
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const res = await fetch("http://localhost:3001/latam").then((res) =>
        res.json()
      );

      const rowsMap = res.map((r) => ({
        ...r,
        operators: r.operators.join(", "),
      }));

      if (!active) return;
      setResult(rowsMap);
    }
  }, []);

  const columns = [
    { field: "destination", headerName: "Destination", width: 75 },
    { field: "city", headerName: "City", width: 150 },
    { field: "country", headerName: "Country", width: 75 },
    { field: "stops", headerName: "Stops", width: 50 },
    { field: "cost", headerName: "Cost", width: 100 },
    { field: "operators", headerName: "Operators", width: 250 },
    { field: "stop1", headerName: "Stop 1", width: 75, renderCell: formatter },
    { field: "stop2", headerName: "Stop 2", width: 75, renderCell: formatter },
    { field: "stop3", headerName: "Stop 3", width: 75, renderCell: formatter },
    //{ field: "stop4", headerName: "Stop 4", width: 75 },
  ];

  return (
    <LayoutContainer>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} height={500}>
          {result && <DataGrid rows={result} columns={columns} />}
        </Grid>
      </MDBox>
    </LayoutContainer>
  );
}

export default DataGridPage;
