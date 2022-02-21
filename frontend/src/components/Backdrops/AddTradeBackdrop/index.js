import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";

import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import ErrorIcon from "@mui/icons-material/Error";

import { TransitionGroup } from "react-transition-group";

import useTimeout from "utils/useTimeout";

function AddTradeBackdrop(props) {
  const { status } = props;

  return (
    <Fade in={!!status} timeout={{ enter: 300, exit: 300 }}>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: "absolute",
        }}
        open={!!status}
      >
        <TransitionGroup>
          {status &&
            (status === "loading" ? (
              <Fade key="circular" timeout={{ enter: 300, exit: 0 }}>
                <CircularProgress color="inherit" />
              </Fade>
            ) : (
              <Fade
                key="submitStatus"
                unmountOnExit
                timeout={{ enter: 300, exit: 300 }}
              >
                <MDBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <StatusMessage {...props} />
                </MDBox>
              </Fade>
            ))}
        </TransitionGroup>
      </Backdrop>
    </Fade>
  );
}

const StatusMessage = ({ status, setSubmitStatus }) => {
  useTimeout(() => setSubmitStatus(null), 2000);
  return (
    <>
      {status === "success" && (
        <>
          <DoneIcon fontSize="large" color="success" />
          <MDTypography mt={1}>Trade added.</MDTypography>
        </>
      )}
      {status === "error" && (
        <>
          <ErrorIcon fontSize="large" color="error" />
          <MDTypography mt={1}>Please try again.</MDTypography>
        </>
      )}
    </>
  );
};

export default AddTradeBackdrop;
