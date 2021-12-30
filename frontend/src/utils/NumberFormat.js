import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

export default function NumFormat({ value, type, decimalScale = 2, ...props }) {
  const { RenderTextAs, children } = props;
  let prefix = type === "$" ? "R$ " : "";
  const suffix = type === "%" ? "%" : null;
  if (value < 0) prefix += "-";
  if (value > 0 && type === "%") prefix += "+";

  return (
    <>
      <NumberFormat
        value={Math.abs(value)}
        displayType={"text"}
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
