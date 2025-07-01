import { parseDate } from "./date.ts";

Deno.test("parseDate", () => {
  const date = new Date(2025, 6, -1);
  const dateParts = parseDate(date);
  console.log(dateParts);
});
