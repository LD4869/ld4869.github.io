import { assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { md2obj } from "./md-to-postgres.ts";

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
