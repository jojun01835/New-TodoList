import { combineReducers } from "@reduxjs/toolkit";
import todosReducer from "../reducers/todos"; // 변경된 부분

const rootReducer = combineReducers({
  todos: todosReducer,
});

export default rootReducer;
