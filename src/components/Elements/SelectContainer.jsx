import React from "react";
import { FormGroup } from "reactstrap";
import PropTypes from "prop-types";

const SelectContainer = (props) => {
  let error = props.hasError && props.hasError(props.name);
  if (!error) error = {};
  return (
    <FormGroup row>
      <label className={`control-label col-xl-${props.lcol}`}>
        {props.label}
      </label>
      <div className={`col-xl-${props.icol}`}>
        <select
          className={
            Object.keys(error).length >= 1
              ? "form-select is-invalid"
              : "form-select"
          }
          name={props.name}
          value={props.value || ""}
          onChange={props.onChange}
          disabled={props.disabled}
        >
          <option key="-1"></option>
          {props.data.map((option, i) => (
            <option key={i} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
        {error["required"] ? (
          <span className="invalid-feedback">Field is required</span>
        ) : (
          ""
        )}
      </div>
    </FormGroup>
  );
};

SelectContainer.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  data: PropTypes.array,
};
SelectContainer.defaultProps = {
  data: [],
  lcol: 4,
  icol: 8,
};

export default SelectContainer;
