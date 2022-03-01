import { useState, useRef, useEffect } from "react";

// react-router-dom components
import { Link, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import SendIcon from "@mui/icons-material/Send";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import BasicLayout from "layouts/Auth/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import {
  useMaterialUIController,
  usePortfolioController,
  setUser,
} from "context";

//Authentication
import {
  verifyUser,
  login,
  auth,
  logInWithGoogle,
  logInWithEmailAndPassword,
} from "services/auth.service";
import { useAuthState } from "react-firebase-hooks/auth";

function Basic() {
  const [portfolioController, portfolioDispatch] = usePortfolioController();
  const [user, loading, AuthError] = useAuthState(auth);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const emailEl = useRef();
  const passwordEl = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [unauthenticated, setUnauthenticated] = useState(false);

  useEffect(() => {
    if (location.state && location.state.error === "UNAUTHENTICATED")
      setUnauthenticated(true);
  }, [location]);

  useEffect(() => {
    console.log(user);
    //if (user) navigate("/dashboard");
  }, [user, loading]);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleAlertCloseButton = () => setError(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    const { error } = await logInWithEmailAndPassword(email, password);
    if (error) {
      setError(error.message);

      if (/user|email/.test(error.message)) setEmailError(true);
      if (error.message.includes("password")) setPasswordError(true);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Log in
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 0, mb: 1 }}
          >
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GoogleIcon onClick={logInWithGoogle} color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={submitHandler}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                inputRef={emailEl}
                fullWidth
                error={emailError}
                disabled={loading}
                onChange={() => setEmailError(false)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                inputRef={passwordEl}
                fullWidth
                error={passwordError}
                disabled={loading}
                onChange={() => setPasswordError(false)}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                isLoadingButton
                loading={loading}
                endIcon={<SendIcon />}
              >
                Log in
              </MDButton>
            </MDBox>
            <MDAlert
              color="error"
              dismissible
              open={error ? true : false}
              handleAlertCloseButton={handleAlertCloseButton}
            >
              {error}
            </MDAlert>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?
                <MDTypography
                  component={Link}
                  to="/auth/signup"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  sx={{ ml: 1 }}
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <MDSnackbar
        color="error"
        icon="error"
        title="Please, log in."
        content="You're not logged in or you session expired."
        dateTime=""
        open={unauthenticated}
        close={() => setUnauthenticated(false)}
      />
    </BasicLayout>
  );
}

export default Basic;
