// 后端服务入口 - Deno HTTP 服务器
/// <reference lib="deno.ns" />

import {
  getAllTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
} from "./handlers.ts";

const PORT = 8000;

// CORS 头
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// 处理请求
async function handleRequest(request: Request): Promise<Response> {
  const { pathname, searchParams } = new URL(request.url);

  // 处理 CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // API 路由
  if (pathname === "/api/todos") {
    // GET /api/todos - 获取所有任务
    if (request.method === "GET") {
      const todos = getAllTodos();
      return Response.json(
        { success: true, data: todos },
        { headers: corsHeaders }
      );
    }

    // POST /api/todos - 创建任务
    if (request.method === "POST") {
      try {
        const body = await request.json();
        const todo = createTodo({ title: body.title });
        return Response.json(
          { success: true, data: todo },
          { headers: corsHeaders }
        );
      } catch (error) {
        return Response.json(
          { success: false, error: "Invalid request" },
          { status: 400, headers: corsHeaders }
        );
      }
    }
  }

  // PUT /api/todos/:id - 更新任务
  if (pathname.startsWith("/api/todos/") && request.method === "PUT") {
    const id = pathname.replace("/api/todos/", "");
    try {
      const body = await request.json();
      const updated = updateTodo(id, body);
      if (!updated) {
        return Response.json(
          { success: false, error: "Todo not found" },
          { status: 404, headers: corsHeaders }
        );
      }
      return Response.json(
        { success: true, data: updated },
        { headers: corsHeaders }
      );
    } catch (error) {
      return Response.json(
        { success: false, error: "Invalid request" },
        { status: 400, headers: corsHeaders }
      );
    }
  }

  // DELETE /api/todos/:id - 删除任务
  if (pathname.startsWith("/api/todos/") && request.method === "DELETE") {
    const id = pathname.replace("/api/todos/", "");
    const deleted = deleteTodo(id);
    if (!deleted) {
      return Response.json(
        { success: false, error: "Todo not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    return Response.json(
      { success: true, data: null },
      { headers: corsHeaders }
    );
  }

  // 404
  return Response.json(
    { success: false, error: "Not found" },
    { status: 404, headers: corsHeaders }
  );
}

// 启动服务器
console.log(`🚀 服务器启动在 http://localhost:${PORT}`);
console.log(`📝 API 文档：GET/POST /api/todos, PUT/DELETE /api/todos/:id`);

Deno.serve({ port: PORT }, handleRequest);
