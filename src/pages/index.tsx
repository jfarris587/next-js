import React from "react";
import StyledButton from "../components/StyledButton/styled-button";

class Index extends React.Component {
  state = {
    open: false
  };

  render() {
    return <StyledButton variant="contained">Styled UI Button</StyledButton>;
  }
}

export default Index;
