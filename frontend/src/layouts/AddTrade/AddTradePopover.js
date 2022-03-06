import { useEffect, useState } from "react";

import Popover from "@mui/material/Popover";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import AddTrade from "./index";

function AddTradePopover(props) {
  const { anchorEl, parentAnchorEl, handleClose } = props;
  const [open, setOpen] = useState(Boolean(anchorEl));

  useEffect(() => {
    setOpen(Boolean(anchorEl));
  }, [anchorEl]);

  return (
    <Popover
      id={open ? "simple-popover" : undefined}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      container={parentAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      PaperProps={{ sx: { backgroundColor: "background.default" } }}
    >
      <MDBox
        display="block"
        position="absolute"
        top={0}
        right={0}
        p={1.625}
        onClick={handleClose}
        sx={{ cursor: "pointer" }}
      >
        <MDTypography variant="h6" color="secondary">
          <Icon sx={{ fontWeight: "bold" }}>close</Icon>
        </MDTypography>
      </MDBox>
      <AddTrade />
    </Popover>
  );
}
export default AddTradePopover;
