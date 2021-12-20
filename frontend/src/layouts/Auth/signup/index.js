import { useState, useRef } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

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

// Authentication layout components
import BasicLayout from "layouts/Auth/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

//Validator
import isEmail from "validator/lib/isEmail";

function Basic() {
  const [loading, setLoading] = useState(false);
  const nameEl = useRef();
  const emailEl = useRef();
  const passwordEl = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
    const name = nameEl.current.value;
    const email = emailEl.current.value;
    const password = passwordEl.current.value;
    console.log(email, password);
    if (!isEmail(email)) return;

    setLoading(true);

    const requestBody = {
      query: `
      mutation {
        createUser(userInput: {
          name: "${name}"
          email: "${email}"
          password: "${password}"
          role: "user"
        }) {
          _id
          email
        }
      }`,
    };
    try {
      const res = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      console.log(res);
    } catch (e) {
      setLoading(false);
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
            Join us today
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
              <MDInput type="tetx" label="Name" inputRef={nameEl} fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                inputRef={emailEl}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                inputRef={passwordEl}
                fullWidth
              />
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
                Register
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?
                <MDTypography
                  component={Link}
                  to="/auth/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  sx={{ ml: 1 }}
                >
                  Log in
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
