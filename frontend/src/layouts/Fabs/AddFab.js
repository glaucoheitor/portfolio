import { useState } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AddTradePopover from "layouts/AddTrade/AddTradePopover";

function AddFab() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [parentAnchorEl, setparentAnchorEl] = useState(null);

  const handleAddClick = (event) => {
    setparentAnchorEl(event.currentTarget.parentNode);
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Fab
        onClick={handleAddClick}
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
        color="primary"
      >
        <AddIcon fontSize="medium" />
      </Fab>
      <AddTradePopover
        parentAnchorEl={parentAnchorEl}
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
}
export default AddFab;
