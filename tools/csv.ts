import * as csv from "@std/csv";
import { ObjectType } from "../src/base-types.ts";

/**
 * 读取CSV文件并解析为数组
 * @param file - CSV文件路径
 * @returns 解析后的CSV数据数组
 */
export function readCSV(file: string) {
  if (!file.endsWith(".csv")) {
    throw new Error("file must be a csv file");
  }

  const csvData = Deno.readTextFileSync(file);
  const objData = csv.parse(csvData, { skipFirstRow: true });
  return objData;
}

export function writeCSV(file: string, data: ObjectType[], columns?: string[]) {
  // 默认写入所有列
  if (!columns) {
    columns = Object.keys(data[0]);
  } else {
    // 检查列名是否在数据中存在
    for (const column of columns) {
      if (!Object.prototype.hasOwnProperty.call(data[0], column)) {
        throw new Error(`column [${column}] not found`);
      }
    }
  }
  // 检查文件后缀名
  if (!file.endsWith(".csv")) {
    throw new Error("file must be a csv file");
  }

  const csvData = csv.stringify(data, { columns });
  Deno.writeTextFileSync(file, csvData);
}
