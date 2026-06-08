/// <reference lib="deno.ns" />
import { assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { assertEquals } from "https://deno.land/std@0.208.0/assert/assert_equals.ts";
import { md2obj, camelToSnake } from "./md-to-postgres.ts";

Deno.test("test-md2obj-数据不足", () => {
  const mdValue = `
  |字段名称|字段类型|是否必填|是否唯一|备注|
  |--------|--------|--------|--------|----|
  `;
  assertThrows(() => md2obj(mdValue), "数据不足");
});

Deno.test("test-md2obj-数据格式不规范", () => {
  const mdValue = `
  |字段名称|字段类型|是否必填|是否唯一|备注|
  |--------|--------|--------|--------|----|
   | id     | serial | 是     | 是     | xxID
  `;

  assertThrows(() => md2obj(mdValue), "数据格式不规范");
});

Deno.test("test-md2obj-数据长度不一致", () => {
  const mdValue = `
  |字段名称|字段类型|是否必填|是否唯一|备注|
  |--------|--------|--------|--------|----|
   | id     | serial | 是     | 是     |
  `;

  assertThrows(() => md2obj(mdValue), "数据长度不一致");
});

// camelToSnake 测试
Deno.test("camelToSnake-test", () => {
  console.log("=== camelToSnake 测试 ===");
  assertEquals(camelToSnake("columnName"), "column_name"); // column_name
  assertEquals(camelToSnake("my_columnName"), "my_column_name"); // my_column_name
  assertEquals(camelToSnake("my_column_name"), "my_column_name"); // my_column_name
  assertEquals(camelToSnake("my-column_name"), "my_column_name"); // my_column_name
  assertEquals(camelToSnake("firstName"), "first_name"); // first_name
  assertEquals(camelToSnake("userName"), "user_name"); // user_name
  assertEquals(camelToSnake("ID"), "id"); // id
  assertEquals(camelToSnake("TEST_NAME"), "test_name"); // test_name
  assertEquals(camelToSnake("myTestColumn"), "my_test_column"); // my_test_column
  assertEquals(camelToSnake("getAllUsersById"), "get_all_users_by_id"); // get_all_users_by_id
  assertEquals(camelToSnake("spuID"), "spu_id"); // spu_id
});
