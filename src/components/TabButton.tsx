// TabButton.tsx

import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

interface StyledTabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

const StyledTabButton = styled.button<StyledTabButtonProps>`
  background-color: ${(props) => (props.isActive ? "#3498db" : "#ffffff")};
  color: ${(props) => (props.isActive ? "#ffffff" : "#333333")};
  border: 1px solid #3498db;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  outline: none;
  margin: 0; /* Added to reset the default margin */
`;

const TabIndicator = styled(motion.div)`
  background-color: #ffffff;
  height: 3px;
  margin-top: 2px;
`;

interface TabButtonProps extends StyledTabButtonProps {
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, ...rest }) => (
  <StyledTabButton {...rest} isActive={isActive}>
    {label}
    {isActive && <TabIndicator initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} transition={{ duration: 0.3 }} />}
  </StyledTabButton>
);

export default TabButton;
