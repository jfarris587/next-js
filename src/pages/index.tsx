import React from "react";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

class Index extends React.Component {
  state = {
    open: false
  };

  render() {
    return <StyledButton variant="contained">Styled UI Button</StyledButton>;
  }
}

const StyledButton = styled(Button)`
  background: red;
  color: white;
`;

export default Index;
