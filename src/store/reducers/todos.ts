import { getDatabase, ref, update } from "firebase/database";
import { RootState, Todo } from "./../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// createSlice 함수로 reducer와 actions를 생성
const todosSlice = createSlice({
  name: "todos",
  initialState: [] as RootState["todos"],
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.push(action.payload);
    },
    setTodos: (state, action: PayloadAction<RootState["todos"]>) => {
      return action.payload || [];
    },
    updateTodo: (state, action: PayloadAction<{ id: string; text: string; image?: string }>) => {
      const todoToUpdate = state.find((todo) => todo.id === action.payload.id);
      if (todoToUpdate) {
        todoToUpdate.text = action.payload.text;
        if (action.payload.image) {
          todoToUpdate.image = action.payload.image;
        }

        const db = getDatabase();
        const todoRef = ref(db, `todos/${action.payload.id}`);
        update(todoRef, { text: action.payload.text, image: action.payload.image || null });
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      const todoIdToDelete = action.payload;
      return state.filter((todo) => todo.id !== todoIdToDelete);
    },
  },
});

// reducer와 action creators를 분리
export const { addTodo, setTodos, updateTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
