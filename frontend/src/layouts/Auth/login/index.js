import { useState, useRef, useEffect } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

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

// Authentication layout components
import BasicLayout from "layouts/Auth/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

//Validator
import isEmail from "validator/lib/isEmail";

import { useMaterialUIController, login } from "context";

function Basic() {
  const [controller, dispatch] = useMaterialUIController();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const emailEl = useRef();
  const passwordEl = useRef();
  let navigate = useNavigate();

  useEffect(async () => {
    const { authData } = controller;
    if (authData.token) {
      setLoading(true);

      try {
        const { data } = await fetch("http://localhost:3001/graphql", {
          method: "POST",
          body: JSON.stringify({ query: `query {verifyUser}` }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authData.token,
          },
        }).then((res) => res.json());
        data.verifyUser && navigate("/trades");
      } catch (e) {
        setLoading(false);
      }
      setLoading(false);
    }
  }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const submitHandler = async (e) => {
    e.preventDefault();

    const email = emailEl.current.value;
    const password = passwordEl.current.value;
    console.log(email, password);
    if (!isEmail(email)) return;

    setLoading(true);

    const requestBody = {
      query: `
      query {
        login(email:"${email}",password:"${password}") {
          userId
          token
          tokenExpiration
        }
      }`,
    };
    try {
      const { data, errors } = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      console.log(data);
      if (!data) throw new Error(errors[0].message);
      login(dispatch, {
        token: data.login.token,
        userId: data.login.userId,
      });
      navigate("/trades");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GoogleIcon color="inherit" />
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
                disabled={loading}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                inputRef={passwordEl}
                fullWidth
                disabled={loading}
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
              <MDButton
                fullWidth
                type="button"
                variant="gradient"
                color="error"
                onClick={() => setError(!error)}
              >
                Error alert
              </MDButton>
            </MDBox>
            {error && (
              <MDAlert color="error" dismissible>
                This is a dismissible alert!
              </MDAlert>
            )}
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
    </BasicLayout>
  );
}

export default Basic;
