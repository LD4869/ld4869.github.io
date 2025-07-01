import { assertEquals, assertNotEquals, assertThrows } from "@std/assert";

Deno.test("assertEquals", () => {
  assertEquals(1 + 1, 2, "1 + 1 should equal 2");
});

Deno.test("assertNotEquals", () => {
  assertNotEquals(1 + 1, 1, "1 + 1 should not equal 1");
});

Deno.test("assertThrows", () => {
  assertThrows(
    // function to test
    () => {
      const tom = [{ name: "Tom" }];
      console.log(tom[1].name);
    },
    // error type
    TypeError,
    // error message
    `Cannot read properties of undefined (reading 'name')`
  );
});
