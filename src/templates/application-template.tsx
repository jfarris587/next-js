import React, { Component, Fragment } from "react";

const ApplicationTemplate = ({ children }) => (
  <Fragment>
    <h1>This is Next JS App</h1>
    {children}
  </Fragment>
);

export default ApplicationTemplate;
