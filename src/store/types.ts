export interface RootState {
  todos: Todo[];
}

export interface Todo {
  id: string | null;
  text: string;
  date: string;
  image: string;
  completed: boolean;
  failed: boolean;
}
