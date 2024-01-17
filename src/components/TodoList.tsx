// src/components/TodoList.tsx

import React, { useEffect, useState } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import store from "../store";
import { RootState } from "../store/types";
import { addTodo, setTodos } from "../store/reducers/todos";
import { Todo } from "../store/types";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import images, { ImageData } from "../assets/images";
import { Database, onValue, ref, getDatabase, push, set } from "firebase/database";
import { database } from "../App";
import Pagination from "./Pagination";
import TabButton from "./TabButton";
import { Link } from "react-router-dom";

// 컴포넌트 스타일

const TodayW = styled.div`
  width: 100%;
  height: auto;
  background: #f5f5f5;
  border: 3px solid #000000;
  border-radius: 30px;
  margin-top: 20px;
  padding: 20px;
  overflow: hidden;
  border: 3px solid #3498db;
  box-sizing: border-box;
`;

const UlList = styled.ul<{ animate: boolean }>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  list-style: none;
  overflow: hidden;
`;

const LiItem = styled.li`
  margin-top: 20px;
  width: 48%;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  box-sizing: border-box;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;

  display: flex;
  flex-direction: column;
`;

const InputText = styled.div`
  width: 100%;
  margin-top: 20px;
  background: #f5f5f5;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #3498db;
  border-radius: 10px;

  div {
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  input {
    flex: 6;
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #3498db;
    border-radius: 5px;
    height: 100%;
  }

  button {
    flex: 1;
    padding: 8px;
    border: none;
    background: #3498db;
    color: #ffffff;
    cursor: pointer;
    border-radius: 5px;
    height: 100%;
    margin-right: 3px;
  }
`;

const TitleBody = styled.div`
  width: 100%;
  margin-top: 20px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;

  p {
    width: 90%;
    font-size: 18px;
    color: #333;
  }
  button {
    background-color: #5ab4f0;
    color: #000000;
    border: none;
    padding: 5px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: "SEBANG", sans-serif;
    margin-right: 12px;

    &:hover {
      background-color: #297fb8;
    }
  }
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CheckBoxLabel = styled.label`
  margin-right: 5px;
`;

const StyledCheckBox = styled.input`
  margin-right: 5px;
  border: 2px solid #3498db;
  border-radius: 3px;
  padding: 3px;
  &:checked {
    background-color: #3498db;
    border-color: #3498db;
    color: #ffffff;
  }
`;

// 컴포넌트 스타일

const TodoList: React.FC = () => {
  const [newTodoText, setNewTodoText] = React.useState("");
  const [selectedimage, setSelectedImage] = useState<string | null>(null);
  const todos = useSelector((state: RootState) => state.todos);
  const [isInputTextOpen, setisInputTextOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState<"all" | "completed" | "failed">("all");
  const [animate, setAnimate] = useState(false);
  const dispatch = useDispatch();

  const PAGE_SIZE = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://todolist-654d7-default-rtdb.firebaseio.com/todos.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data from Firebase");
        }

        const data: { [key: string]: RootState["todos"][number] } = await response.json();
        console.log("Fetched data:", data);

        const dataArray: RootState["todos"] = Object.entries(data || {}).map(([id, todo]) => ({
          ...todo,
          id,
        }));
        console.log("Fetched data", dataArray);
        dispatch(setTodos(dataArray));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  // 이미지를 TodoList에 더하기
  const handleImageSelect = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };
  // 이미지를 TodoList에 더하기

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // todolist 추가
  const handleAddTodo = (text: string) => {
    if (text.trim() !== "" && selectedimage) {
      const todosRef = ref(database, "todos");
      const newTodo = {
        text,
        date: new Date().toISOString().split("T")[0],
        image: selectedimage,
        completed: false,
        failed: false,
      };

      try {
        const pushedRef = push(todosRef, newTodo);
        const todoId = pushedRef.key;
        dispatch(
          addTodo({
            id: todoId, // id 설정
            text: newTodo.text,
            date: newTodo.date,
            image: newTodo.image,
            completed: newTodo.completed,
            failed: newTodo.failed,
          })
        );
        setNewTodoText("");
        setSelectedImage(null);
      } catch (err) {
        console.error("Error adding todo to Firebase: ", err);
      }
    }
  };

  // todolist 추가

  // 입력폼 토글
  const toggleButton = () => {
    setisInputTextOpen(!isInputTextOpen);
  };
  // 입력폼 토글

  // todo 탭
  const filteredTodos = () => {
    switch (currentTab) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "failed":
        return todos.filter((todo) => todo.failed);
      default:
        return todos;
    }
  };

  // 체크박스 전송
  const handleCheckboxToggle = async (todoId: string | null, type: "completed" | "failed") => {
    const updatedTodos = todos.map((todo) => (todo.id === todoId ? { ...todo, [type]: !todo[type] } : todo));

    try {
      const todosRef = ref(database, "todos");
      await set(todosRef, updatedTodos);
    } catch (err) {
      console.log("Error ", err);
    }

    dispatch(setTodos(updatedTodos));
    // set(ref(database, "todos"), updatedTodos);
  };

  // 버튼 애니메이션
  const handleTabChange = (tab: "all" | "completed" | "failed") => {
    setCurrentTab(tab);
  };
  return (
    <Provider store={store}>
      <TodayW>
        <TitleBody>
          <p>TodoList</p>
          <button onClick={toggleButton}>{isInputTextOpen ? "Close" : "Open"}</button>
        </TitleBody>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
          <TabButton label="All" isActive={currentTab === "all"} onClick={() => handleTabChange("all")} />
          <TabButton label="Completed" isActive={currentTab === "completed"} onClick={() => handleTabChange("completed")} />
          <TabButton label="Failed" isActive={currentTab === "failed"} onClick={() => handleTabChange("failed")} />
        </div>
        <AnimatePresence>
          {isInputTextOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <InputText>
                <div>
                  <input type="text" value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)}></input>
                  <button onClick={() => handleAddTodo(newTodoText)}>전송</button>
                  <button>지우기</button>
                </div>
                <motion.ul
                  className="new-challenge-images"
                  variants={{
                    visible: { transition: { staggerChildren: 0.15 } },
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    WebkitFlexDirection: "row",
                  }}
                >
                  {images.map((image: ImageData, index: number) => (
                    <motion.li
                      key={index}
                      variants={{
                        hidden: { opacity: 0, scale: 0.5 },
                        visible: { opacity: 1, scale: [0.8, 1.3, 1] },
                      }}
                      exit={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring" }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleImageSelect(image.src)}
                      style={{
                        marginBottom: "10px",
                        border: `5px solid ${selectedimage === image.src ? "#3498db" : "transparent"}`, // 선택된 이미지일 때 테두리 추가
                      }}
                    >
                      <motion.div
                        style={{
                          backgroundImage: `url(${image.src})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    </motion.li>
                  ))}
                </motion.ul>
              </InputText>
            </motion.div>
          )}
        </AnimatePresence>
        <UlList animate={animate}>
          {filteredTodos()
            .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
            .map((todo: Todo, index: number) => (
              <LiItem key={todo.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ marginBottom: "10px" }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <Link to={`/detail/${todo.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ marginBottom: "10px" }}>{todo.text}</div>
                    </Link>
                    <div style={{ marginBottom: "10px" }}>{todo.date}</div>
                    <CheckBoxWrapper>
                      <CheckBoxLabel>성공</CheckBoxLabel>
                      <StyledCheckBox type="checkbox" checked={todo.completed} onChange={() => handleCheckboxToggle(todo.id, "completed")} />
                    </CheckBoxWrapper>
                    <CheckBoxWrapper>
                      <CheckBoxLabel>실패</CheckBoxLabel>
                      <StyledCheckBox type="checkbox" checked={todo.failed} onChange={() => handleCheckboxToggle(todo.id, "failed")} />
                    </CheckBoxWrapper>
                  </div>
                  <div>
                    <img src={todo.image} alt={todo.text} style={{ width: "50px", height: "50px" }} />
                  </div>
                </motion.div>
              </LiItem>
            ))}
        </UlList>
        <Pagination currentPage={currentPage} totalPages={Math.ceil(todos.length / PAGE_SIZE)} onPageChange={handlePageChange}></Pagination>
      </TodayW>
    </Provider>
  );
};

export default TodoList;
