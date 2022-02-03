import React from "react";
import PropTypes from "prop-types";
import { Navbar } from "reactstrap";

const TopPanel = props => {
  return <Navbar color="light" light expand="md">
    <h3>{props.title}</h3>
  </Navbar>
};

TopPanel.propTypes = {
  title: PropTypes.string.isRequired
};

export default TopPanel;
