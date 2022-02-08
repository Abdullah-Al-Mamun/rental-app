import React from "react";
import { FormGroup } from "reactstrap";
import PropTypes from "prop-types";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { AppConst } from "../../utils/Util";

const DateTimeContainer = props => {
  let error = props.hasError && props.hasError(props.name);
  error = error && Object.keys(error).length >= 1;
  return (
    <FormGroup row>
      <label className={`control-label col-xl-${props.lcol}`}>
        {props.label}
      </label>
      <div className={`col-xl-${props.icol}`}>
        <Datetime
          onChange={moment =>
            props.onChange(
              moment,
              props.name,
              props.isDate && props.isTime
                ? `${AppConst.DateFormat} ${AppConst.TimeFormat}`
                : props.isDate
                  ? AppConst.DateFormat
                  : AppConst.TimeFormat
            )
          }
          inputProps={{
            name: props.name,
            value: props.value || "",
            className: error ? "form-control Date-Time is-invalid" : "form-control Date-Time",
            // readOnly: "readOnly",
            disabled: props.readOnly,
            placeholder: props.placeholder
          }}
          dateFormat={props.isDate ? AppConst.DateFormat : false}
          timeFormat={props.isTime ? AppConst.TimeFormat : false}
          closeOnSelect={true}
        />
        {error ? <span className="invalid-feedback-custom">Field is required</span> : ""}
      </div>
    </FormGroup>
  );
}

DateTimeContainer.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
DateTimeContainer.defaultProps = {
  lcol: 4,
  icol: 8
};

export default DateTimeContainer;
