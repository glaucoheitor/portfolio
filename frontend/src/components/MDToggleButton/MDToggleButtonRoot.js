// @mui material components
import { ToggleButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/system";

export default styled(ToggleButton)(({ theme, ownerState }) => {
  const { palette, functions, borders, boxShadows, components, typography } =
    theme;
  const { color, fullWidth } = ownerState;

  const { white, text, transparent, gradients } = palette;
  const { boxShadow, linearGradient, rgba } = functions;
  const { colored } = boxShadows;

  const selectedOpacity = 0.16;
  const hoverOpacity = 0.08;

  // styles for the button with variant="outlined"
  const outliedStyles = () => {
    // background color value
    const backgroundValue =
      color === "white" ? rgba(white.main, 0.1) : transparent.main;

    // color value
    const colorValue = palette[color] ? palette[color].main : white.main;

    // boxShadow value
    const boxShadowValue = palette[color]
      ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
      : boxShadow([0, 0], [0, 3.2], white.main, 0.5);

    // border color value
    let borderColorValue = palette[color]
      ? palette[color].main
      : rgba(white.main, 0.75);

    if (color === "white") {
      borderColorValue = rgba(white.main, 0.75);
    }

    return {
      ...components.MuiButton.styleOverrides.root,
      ...typography.button,
      background: backgroundValue,
      color: colorValue,
      borderColor: borderColorValue,
      padding: 11,
      ...(fullWidth && {
        width: "100%",
      }),
      "&:hover": {
        textDecoration: "none",
        // Reset on mouse devices
        backgroundColor: alpha(colorValue, hoverOpacity),
        "@media (hover: none)": {
          backgroundColor: "transparent",
        },
      },

      "&.Mui-disabled": {
        color: colorValue,
        borderColor: colorValue,
      },

      "&.Mui-selected": {
        color: colorValue,
        backgroundColor: alpha(colorValue, selectedOpacity),
        "&:hover": {
          backgroundColor: alpha(colorValue, selectedOpacity + hoverOpacity),
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: alpha(colorValue, selectedOpacity),
          },
        },
      },
    };
  };

  // styles for the button with variant="gradient"
  const gradientStyles = () => {
    // background value
    const backgroundValue =
      color === "white" || !gradients[color]
        ? white.main
        : linearGradient(gradients[color].main, gradients[color].state);

    // boxShadow value
    const boxShadowValue = colored[color]
      ? `${boxShadow([0, 3], [3, 0], palette[color].main, 0.15)}, ${boxShadow(
          [0, 3],
          [1, -2],
          palette[color].main,
          0.2
        )}, ${boxShadow([0, 1], [5, 0], palette[color].main, 0.15)}`
      : "none";

    // boxShadow value when button is hovered
    const hoveredBoxShadowValue = colored[color]
      ? `${boxShadow(
          [0, 14],
          [26, -12],
          palette[color].main,
          0.4
        )}, ${boxShadow(
          [0, 4],
          [23, 0],
          palette[color].main,
          0.15
        )}, ${boxShadow([0, 8], [10, -5], palette[color].main, 0.2)}`
      : "none";

    // color value
    let colorValue = white.main;

    if (color === "white") {
      colorValue = text.main;
    } else if (color === "light") {
      colorValue = gradients.dark.state;
    }

    return {
      background: backgroundValue,
      color: colorValue,
      boxShadow: boxShadowValue,

      "&:hover": {
        boxShadow: hoveredBoxShadowValue,
      },

      "&:focus:not(:hover)": {
        boxShadow: boxShadowValue,
      },

      "&:disabled": {
        background: backgroundValue,
        color: colorValue,
      },
    };
  };

  return outliedStyles();
});
