// 在 z1p-deno/cli/data-sync.test.ts 中测试
Deno.test("get-client-name-todo-list", () => {
  for (const client of z1Clients) {
    if (client.state !== "valid") {
      continue;
    }
    console.log(`- [ ] ${client.name}`);
  }
});
