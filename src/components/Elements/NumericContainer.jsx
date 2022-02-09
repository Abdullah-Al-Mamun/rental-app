import React from "react";
import { FormGroup } from "reactstrap";
import PropTypes from "prop-types";
import { NumericKeyDown, NumericKeyPress } from "../../utils/Util";

const NumericContainer = (props) => {
  let error = props.hasError && props.hasError(props.name);
  if (!error) error = {};
  return (
    <FormGroup row>
      <label htmlFor={props.name} className={`control-label col-xl-${props.lcol}`}>
        {props.label}
      </label>
      <div className={`col-xl-${props.icol}`}>
        <input
          type="text"
          className={
            Object.keys(error).length >= 1
              ? "form-control text-right is-invalid"
              : "form-control text-right"
          }
          name={props.name}
          value={props.value || ""}
          onChange={props.onChange}
          onKeyDown={NumericKeyDown}
          onKeyPress={NumericKeyPress}
          readOnly={props.readOnly}
          scale={props.scale}
          autoComplete="off"
          placeholder={props.placeholder}
        />
        <span className="invalid-feedback">Field is required</span>
      </div>
    </FormGroup>
  );
};

NumericContainer.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
NumericContainer.defaultProps = {
  lcol: 4,
  icol: 8,
};

export default NumericContainer;
