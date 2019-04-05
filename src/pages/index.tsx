import React, { Fragment } from "react";
import StyledButton from "../components/StyledButton/styled-button";

class Index extends React.Component {
  state = {
    open: false
  };

  render() {
    return (
      <Fragment>
        <a href="/a">a</a>
        <br />
        <a href="/b">b</a>
        <br />

        <StyledButton variant="contained">Styled UI Button</StyledButton>
      </Fragment>
    );
  }
}

export default Index;
