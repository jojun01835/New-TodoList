import React from "react";
import { Provider } from "react-redux";
import "./App.css";
import Header from "./UI/Header/Header";
import Body from "./UI/Body/Body";
import store from "./store";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDnTexhKx2QqgP8I0lU1JY6t2sriTxdD9w", // API 키
  authDomain: "todolist-654d7.firebaseapp.com", // 인증 도메인
  projectId: "todolist-654d7", // 데이터베이스 URL
  storageBucket: "todolist-654d7.appspot.com", // 스토리지 버킷
  messagingSenderId: "873580113934",
  appId: "1:873580113934:web:327880df45161c7f310c5f",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// interface ExtendedRouteProps {
//   path: String;
//   element: React.ReactNode;
// }

function App() {
  return (
    <Provider store={store}>
      <div>
        <Header />
        <Body />
      </div>
    </Provider>
  );
}

export default App;
