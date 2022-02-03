import React from "react";
import { FormGroup } from "reactstrap";
import PropTypes from "prop-types";

const TextContainer = props => {
  let error = props.hasError && props.hasError(props.name);
  if (!error) error = {};
  return (
    <FormGroup row>
      <label className={`control-label col-xl-${props.lcol}`}>
        {props.label}
      </label>
      <div className={`col-xl-${props.icol}`}>
        <input
          type={props.type}
          className={Object.keys(error).length >= 1 ? "form-control is-invalid" : "form-control"}
          name={props.name}
          value={props.value || ""}
          onChange={props.onChange}
          readOnly={props.readOnly}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
        />
        {error["required"] ? <span className="invalid-feedback">Field is required</span> : ""}
        {error["email"] ? <span className="invalid-feedback">Field must be valid email</span> : ""}
      </div>
    </FormGroup>
  );
}

TextContainer.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
TextContainer.defaultProps = {
  type: "text",
  lcol: 4,
  icol: 8
};

export default TextContainer;
