// 后端 API 处理器

import { Todo, CreateTodoRequest, UpdateTodoRequest } from "./types.ts";

// 内存存储（生产环境应使用数据库）
const todos: Map<string, Todo> = new Map();

// 生成唯一 ID
function generateId(): string {
  return Date.now().toString();
}

// 获取所有任务
export function getAllTodos(): Todo[] {
  return Array.from(todos.values());
}

// 创建任务
export function createTodo(req: CreateTodoRequest): Todo {
  const id = generateId();
  const todo: Todo = {
    id,
    title: req.title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.set(id, todo);
  return todo;
}

// 获取单个任务
export function getTodo(id: string): Todo | undefined {
  return todos.get(id);
}

// 更新任务
export function updateTodo(id: string, req: UpdateTodoRequest): Todo | undefined {
  const todo = todos.get(id);
  if (!todo) return undefined;

  if (req.title !== undefined) {
    todo.title = req.title;
  }
  if (req.completed !== undefined) {
    todo.completed = req.completed;
  }

  todos.set(id, todo);
  return todo;
}

// 删除任务
export function deleteTodo(id: string): boolean {
  return todos.delete(id);
}
