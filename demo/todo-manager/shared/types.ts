// 前后端共享的类型定义

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ApiResponseTodos = ApiResponse<Todo[]>;
export type ApiResponseTodo = ApiResponse<Todo>;
