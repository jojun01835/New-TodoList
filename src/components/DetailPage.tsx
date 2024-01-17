// DetailPage.tsx

import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/types";
import { updateTodo, deleteTodo } from "../store/reducers/todos";
import { motion } from "framer-motion";
import images, { ImageData } from "../assets/images";
import { child, ref, remove } from "firebase/database";
import { database } from "../App";

interface Params {
  id: string;
}

const DetailContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 800px;
  background-color: #f5f5f5;
`;

const DetailCard = styled.div`
  width: 50%;
  padding: 20px;
  background-color: #ffffff;
  border: 3px solid #3498db;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  h2 {
    color: #3498db;
    margin-bottom: 20px;
  }

  input {
    font-size: 18px;
    padding: 8px;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  img {
    width: 100px;
    height: 100px;
    margin: 20px 0;
  }

  button {
    background-color: #3498db;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    margin-top: 20px;

    &:hover {
      background-color: #297fb8;
    }
  }
`;

const BackButton = styled.button`
  background-color: #3498db;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  margin-top: 20px;

  &:hover {
    background-color: #297fb8;
  }
`;

const Input = styled.input`
  font-size: 18px;
  padding: 10px;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  border: 2px solid #3498db; /* 테두리 색상 */
  border-radius: 5px;
  outline: none; /* 포커스 효과 제거 */
  box-sizing: border-box; /* padding과 border 크기를 포함하여 전체 크기 유지 */
  transition: border-color 0.3s ease-in-out; /* 테두리 색상 변화에 부드러운 전환 효과 */

  &:focus {
    border-color: #297fb8; /* 포커스 시 테두리 색상 변화 */
  }
`;

const DetailPage: React.FC = () => {
  const { id } = useParams<Params>();
  const todos = useSelector((state: RootState) => state.todos);
  const selectedTodo = todos.find((todo) => todo.id === id);
  const [updatedText, setUpdatedText] = useState(selectedTodo?.text || "");
  const dispatch = useDispatch();
  const history = useHistory();
  const [updatedImage, setUpdatedImage] = useState(selectedTodo?.image || "");

  const handleUpdateTodo = () => {
    if (selectedTodo) {
      dispatch(updateTodo({ id: selectedTodo.id as string, text: updatedText, image: updatedImage }));
    }
  };

  const handleImageSelect = (imageSrc: string) => {
    setUpdatedImage(imageSrc);
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const handleDeleteTodo = () => {
    if (selectedTodo && selectedTodo.id) {
      const todosRef = ref(database, "todos");
      const todoRef = child(todosRef, selectedTodo.id);

      try {
        remove(todoRef);
        dispatch(deleteTodo(selectedTodo.id));

        history.goBack();
      } catch (err) {
        console.error("삭제하는데 문제가 발생했네요 ", err);
      }
    }
  };

  if (!selectedTodo) {
    return <p>해당 todo를 찾을수 없습니다</p>;
  }

  return (
    <DetailContainer>
      <DetailCard>
        <h2>Detail Page</h2>
        <Input type="text" value={updatedText} onChange={(e) => setUpdatedText(e.target.value)} />
        <p>{selectedTodo.text}</p>
        <p>시간: {selectedTodo.date}</p>
        <p>성공여부: {selectedTodo.completed ? "성공" : "실패"}</p>
        <div>
          <motion.ul
            className="new-challenge-images"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexWrap: "wrap", WebkitFlexDirection: "row" }}
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
                  border: `5px solid ${updatedImage === image.src ? "#3498db" : "transparent"}`, // 선택된 이미지일 때 테두리 추가
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
        </div>
        <img src={selectedTodo.image} alt={selectedTodo.text} style={{ width: "100px", height: "100px", margin: "20px 0" }}></img>
        <div>
          <button onClick={handleUpdateTodo} style={{ marginRight: "20px" }}>
            수정
          </button>
          <BackButton onClick={handleGoBack}>뒤로가기</BackButton>
          <button style={{ marginLeft: "20px" }} onClick={handleDeleteTodo}>
            삭제하기
          </button>
        </div>
      </DetailCard>
    </DetailContainer>
  );
};

export default DetailPage;
