import { readCSV, writeCSV } from "./csv.ts";

Deno.test("readCSV", () => {
  const res = readCSV("test.csv");
  console.log(res);
});

Deno.test("writeCSV", () => {
  const file = "test-write.csv";
  const data = [
    { name: "nrj", age: 28 },
    { name: "fc", age: 29 },
    { age: 12, name: "phd" },
  ];
  const columns = ["name", "age"];
  writeCSV(file, data, columns);
});
