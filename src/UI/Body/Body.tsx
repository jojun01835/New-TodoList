import React from "react";
import styled from "styled-components";
import TodayList from "../../components/TodayList";
import TodoList from "../../components/TodoList";
import ToDay from "../../components/ToDay";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DetailPage from "../../components/DetailPage";

const BodyStyle = styled.section`
  width: 100%;
  height: auto;
  background: #ffffff;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  align-content: center;
  box-sizing: border-box;
  margin: 0 auto;
`;

const Body = () => {
  return (
    <Router>
      <BodyStyle>
        <Switch>
          <Route path="/" exact>
            <ToDay />
            <TodayList />
            <TodoList />
          </Route>
          <Route path="/detail/:id" component={DetailPage} />
        </Switch>
      </BodyStyle>
    </Router>
  );
};

export default Body;
