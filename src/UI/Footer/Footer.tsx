import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  width: 100%;
  background: #d06c6c;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <h2>하단푸터임니다</h2>
    </StyledFooter>
  );
};

export default Footer;
