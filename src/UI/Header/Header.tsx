import React from "react";
import styled from "styled-components";
import icon from "../../img/favicon.png";

const HeaderStyle = styled.header`
  width: 100%;
  height: 80px;
  display: flex;
  background: #3498db;
  margin-top: 2%;
  justify-content: space-between; /* 변경: 좌우 정렬 */
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;

  h1 {
    color: #ffffff;
    font-size: 1.5em;
    margin-left: 10px;
    font-family: "SEBANG", sans-serif;
  }

  ul {
    display: flex;
    color: #ffffff;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-left: 20px;
      font-size: 1.2em;
      cursor: pointer;
      transition: color 0.3s ease;
      font-family: "SEBANG", sans-serif;

      &:hover {
        color: #cecdcd;
      }
    }
  }
`;

const IconImage = styled.img`
  width: 50px;
  height: 50px;
`;

const DivBox = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => {
  return (
    <HeaderStyle>
      <DivBox>
        <h1>TodoList</h1>
      </DivBox>
    </HeaderStyle>
  );
};

export default Header;
