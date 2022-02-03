import React from "react";
import { InputText } from "primereact/inputtext";
import PropTypes from "prop-types";

const SearchContainer = (props) => {
  return (
    <div
      style={{ textAlign: "right" }}
      className="flex justify-content-between"
    >
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          name={props.name}
          value={props.value || ""}
          onChange={props.onChange}
          placeholder={props.placeholder}
        />
      </span>
    </div>
  );
};

SearchContainer.propTypes = {
  placeholder: PropTypes.string,
};
SearchContainer.defaultProps = {
  type: "text",
  placeholder: "Keyword Search",
};

export default SearchContainer;
