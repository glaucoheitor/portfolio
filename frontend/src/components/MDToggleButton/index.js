import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import clsx from "clsx";

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
    children,
    className,
    color,
    size,
    disabled = false,
    disableFocusRipple = false,
    fullWidth = false,
    onChange,
    onClick,
    selected,
    value,
    ...rest
  } = props;

  const ownerState = {
    ...props,
    color,
    size,
    disabled,
    disableFocusRipple,
    fullWidth,
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
      className={clsx(classes.root, className)}
      ref={ref}
      color="primary"
      size={size}
      onClick={handleChange}
      onChange={onChange}
      value={value}
      aria-pressed={selected}
      ownerState={ownerState}
      {...rest}
    >
      {children}
    </MDToggleButtonRoot>
  );
});

// Setting default values for the props of MDToggleButton
MDToggleButton.defaultProps = {
  size: "medium",
  color: "white",
};

// Typechecking props for the MDToggleButton
MDToggleButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
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
