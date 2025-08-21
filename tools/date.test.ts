import { assertEquals } from "@std/assert/equals";
import { formatDate, parseDate } from "./date.ts";

Deno.test("parseDate", () => {
  const date = new Date(2025, 6, -1);
  const dateParts = parseDate(date);
  console.log(dateParts);
});

Deno.test("formatDate 指定日期", () => {
  const inputDate = new Date(2025, 6, 2, 3, 4, 5);
  const res = formatDate({ inputDate });
  console.log(res);

  assertEquals(res.fullDateFormat, "2025-07-02T03:04:05");
  assertEquals(res.dateFormat, "2025-07-02");
  assertEquals(res.timeFormat, "03:04:05");
});

Deno.test("formatDate now", () => {
  const inputDate = new Date();
  const res = formatDate({ inputDate });
  console.log(res);
});

Deno.test("formatDate separator", () => {
  const inputDate = new Date(2025, 6, 2, 3, 4, 5);
  const res = formatDate({ inputDate, separator: "" });
  console.log(res);

  assertEquals(res.fullDateFormat, "20250702030405");
  assertEquals(res.dateFormat, "20250702");
  assertEquals(res.timeFormat, "030405");
});
