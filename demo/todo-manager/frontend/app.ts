// 前端应用逻辑

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 配置
const API_URL = "http://localhost:8000/api/todos";
const statusEl = document.getElementById("status") as HTMLElement;
const todoInput = document.getElementById("todoInput") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLElement;
const todoList = document.getElementById("todoList") as HTMLElement;
const totalCountEl = document.getElementById("totalCount") as HTMLElement;
const completedCountEl = document.getElementById("completedCount") as HTMLElement;
const pendingCountEl = document.getElementById("pendingCount") as HTMLElement;

let todos: Todo[] = [];

// 获取所有任务
async function fetchTodos(): Promise<void> {
  try {
    const response = await fetch(API_URL);
    const data: ApiResponse<Todo[]> = await response.json();

    if (data.success && data.data) {
      todos = data.data;
      renderTodos();
      updateStats();
      updateStatus("✅ 已连接服务器", "success");
    } else {
      updateStatus("❌ 服务器响应错误", "error");
    }
  } catch (error) {
    console.error("获取任务失败:", error);
    updateStatus("❌ 无法连接服务器", "error");
  }
}

// 创建任务
async function addTodo(): Promise<void> {
  const title = todoInput.value.trim();

  if (!title) {
    updateStatus("⚠️ 请输入任务标题", "warning");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const data: ApiResponse<Todo> = await response.json();

    if (data.success && data.data) {
      todos.push(data.data);
      todoInput.value = "";
      renderTodos();
      updateStats();
      updateStatus("✅ 任务已添加", "success");
    } else {
      updateStatus("❌ 添加失败", "error");
    }
  } catch (error) {
    console.error("添加任务失败:", error);
    updateStatus("❌ 添加失败", "error");
  }
}

// 更新任务
async function toggleTodo(id: string): Promise<void> {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    const data: ApiResponse<Todo> = await response.json();

    if (data.success && data.data) {
      const idx = todos.findIndex((t) => t.id === id);
      if (idx >= 0) {
        todos[idx] = data.data;
      }
      renderTodos();
      updateStats();
    }
  } catch (error) {
    console.error("更新任务失败:", error);
    updateStatus("❌ 更新失败", "error");
  }
}

// 删除任务
async function deleteTodo(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const data: ApiResponse<null> = await response.json();

    if (data.success) {
      todos = todos.filter((t) => t.id !== id);
      renderTodos();
      updateStats();
      updateStatus("✅ 任务已删除", "success");
    } else {
      updateStatus("❌ 删除失败", "error");
    }
  } catch (error) {
    console.error("删除任务失败:", error);
    updateStatus("❌ 删除失败", "error");
  }
}

// 渲染任务列表
function renderTodos(): void {
  if (todos.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <p>📭 暂无任务</p>
        <p class="hint">添加一个新任务开始吧</p>
      </div>
    `;
    return;
  }

  todoList.innerHTML = todos
    .map(
      (todo) => `
    <div class="todo-item ${todo.completed ? "completed" : ""}">
      <input
        type="checkbox"
        class="todo-checkbox"
        ${todo.completed ? "checked" : ""}
        onchange="window.app.toggleTodo('${todo.id}')"
      />
      <span class="todo-text">${escapeHtml(todo.title)}</span>
      <span class="todo-time">${formatTime(todo.createdAt)}</span>
      <button class="btn-delete" onclick="window.app.deleteTodo('${todo.id}')">
        删除
      </button>
    </div>
  `
    )
    .join("");
}

// 更新统计信息
function updateStats(): void {
  const completed = todos.filter((t) => t.completed).length;
  const pending = todos.length - completed;

  totalCountEl.textContent = todos.length.toString();
  completedCountEl.textContent = completed.toString();
  pendingCountEl.textContent = pending.toString();
}

// 更新状态信息
function updateStatus(message: string, type: string = "info"): void {
  statusEl.textContent = message;
  statusEl.style.color = type === "error" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#10b981";
}

// 格式化时间
function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return "刚才";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;

  return date.toLocaleDateString("zh-CN");
}

// HTML 转义
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 事件监听
addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// 暴露给 HTML 的全局对象
(window as any).app = {
  toggleTodo,
  deleteTodo,
};

// 初始化
fetchTodos();
// 定期刷新（可选）
setInterval(fetchTodos, 30000);
