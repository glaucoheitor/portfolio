import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import {
  generateUtilityClass,
  unstable_composeClasses as composeClasses,
} from "@mui/base";

// Custom styles for MDToggleButton
import MDToggleButtonRoot from "components/MDToggleButton/MDToggleButtonRoot";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

const useUtilityClasses = (ownerState) => {
  const { classes, fullWidth, selected, disabled, size, color } = ownerState;

  const slots = {
    root: [
      "root",
      selected && "selected",
      disabled && "disabled",
      fullWidth && "fullWidth",
      color,
    ],
  };

  return composeClasses(slots, getToggleButtonUtilityClass, classes);
};

function getToggleButtonUtilityClass(slot) {
  return generateUtilityClass("MuiToggleButton", slot);
}

const MDToggleButton = forwardRef((props, ref) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const {
    color,
    variant,
    size,
    onChange,
    onClick,
    selected,
    value,
    children,
    ...rest
  } = props;

  const ownerState = {
    ...props,
    color,
    variant,
    size,
    darkMode,
  };

  const handleChange = (event) => {
    if (onClick) {
      onClick(event, value);
      if (event.defaultPrevented) {
        return;
      }
    }

    if (onChange) {
      onChange(event, value);
    }
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <MDToggleButtonRoot
      {...rest}
      className={classes.root}
      ref={ref}
      color="primary"
      variant={variant === "gradient" ? "contained" : variant}
      size={size}
      onClick={handleChange}
      onChange={onChange}
      value={value}
      aria-pressed={selected}
      ownerState={ownerState}
    >
      {children}
    </MDToggleButtonRoot>
  );
});

// Setting default values for the props of MDToggleButton
MDToggleButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
};

// Typechecking props for the MDToggleButton
MDToggleButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  children: PropTypes.node.isRequired,
};

export default MDToggleButton;
