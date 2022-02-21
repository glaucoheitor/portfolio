import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

import Skeleton from "@mui/material/Skeleton";

export default function NumFormat({
  value,
  type,
  extraSuffix,
  decimalScale = 2,
  ...props
}) {
  const { RenderTextAs, children } = props;

  if (!value)
    return RenderTextAs && RenderTextAs !== "none" ? (
      <RenderTextAs {...props}>
        <Skeleton animation="wave" width={100} />
      </RenderTextAs>
    ) : (
      <Skeleton animation="wave" width={100} />
    );

  let prefix = type === "$" ? "R$ " : "";
  let suffix = type === "%" ? "%" : "";
  if (extraSuffix) suffix += extraSuffix;
  if (value < 0) prefix += "-";
  if (value > 0 && type === "%") prefix += "+";

  return (
    <>
      <NumberFormat
        value={Math.abs(value)}
        displayType="text"
        thousandSeparator={"."}
        decimalSeparator={","}
        prefix={prefix}
        suffix={suffix}
        decimalScale={decimalScale}
        fixedDecimalScale
        renderText={
          //If renderTextAs exists, check if its "none", if it's not then use its value as component
          RenderTextAs
            ? RenderTextAs === "none"
              ? (formattedValue, customProps) => formattedValue
              : (formattedValue, customProps) => (
                  <RenderTextAs {...customProps}>{formattedValue}</RenderTextAs>
                )
            : undefined
        }
        {...props}
      />
      {children}
    </>
  );
}

NumFormat.propTypes = {
  value: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  decimalScale: PropTypes.number,
  RenderTextAs: PropTypes.string,
  children: PropTypes.node,
};
