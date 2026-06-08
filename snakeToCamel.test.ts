import { assertEquals } from "https://deno.land/std@0.221.0/testing/asserts.ts";
import snakeToCamel from "./snakeToCamel.ts";

Deno.test("snakeToCamel() 转换测试", () => {
  // 基本测试用例
  assertEquals(snakeToCamel("spu_id"), "spuID");
  assertEquals(snakeToCamel("spu_name"), "spuName");
  assertEquals(snakeToCamel("user_ident"), "userIdent");

  // 其他常见用例
  assertEquals(snakeToCamel("user_id"), "userID");
  assertEquals(snakeToCamel("first_name"), "firstName");
  assertEquals(snakeToCamel("last_name"), "lastName");

  // 多个下划线的情况
  assertEquals(snakeToCamel("a_b_c"), "aBC");
  assertEquals(snakeToCamel("my_variable_name"), "myVariableName");

  // 单个单词（无下划线）
  assertEquals(snakeToCamel("hello"), "hello");
  assertEquals(snakeToCamel("test"), "test");

  // 空字符串
  assertEquals(snakeToCamel(""), "");

  // 只有下划线
  assertEquals(snakeToCamel("_"), "_");
  assertEquals(snakeToCamel("_test"), "Test");
});

Deno.test("snakeToCamel() 错误处理测试", () => {
  // 测试非字符串输入（应该抛出错误）
  try {
    // @ts-ignore - 故意传入非字符串类型测试错误处理
    snakeToCamel(123 as any);
    // 如果没有抛出错误，测试失败
    throw new Error("Expected error for non-string input");
  } catch (error) {
    assertEquals((error as Error).message, "Input must be a string");
  }

  try {
    // @ts-ignore - 故意传入非字符串类型测试错误处理
    snakeToCamel(null as any);
    // 如果没有抛出错误，测试失败
    throw new Error("Expected error for non-string input");
  } catch (error) {
    assertEquals((error as Error).message, "Input must be a string");
  }
});
