/**
 * 计算字符串中指定字符出现的次数
 *
 * **参数校验：**
 * - 如果 `char` 长度不为 1，抛出错误
 *
 * @param str 要搜索的字符串
 * @param char 要计数的字符
 * @returns 字符在字符串中出现的次数
 * @throws {Error} 当 char 长度不为 1 时抛出错误
 *
 * @example
 * ```ts
 * countChar("|abc|", "|"); // 返回 3
 * countChar("hello", "l"); // 返回 2
 * countChar("hello", "x"); // 返回 0
 * ```
 */
function countChar(str: string, char: string) {
  if (char.length !== 1) {
    throw new Error("被检索的字符长度应该为1");
  }
  return str.split("").filter((v) => v === char).length;
}

/**
 * 将 Markdown 表格格式的数据库字段定义字符串转换为对象数组
 *
 * 该函数解析符合特定格式的 Markdown 表格，每一行代表一个数据库字段定义。
 * 支持的数据格式：Markdown 表格，包含表头和至少一行数据。
 *
 * **输入格式要求：**
 * - 表头必须为固定格式：`|字段名称|字段类型|是否必填|是否唯一|备注|`
 * - 数据行：每行以 `|` 开头和结尾，列数必须与表头一致
 * - 必须包含表头和数据行，且至少一行数据
 *
 * **列定义：**
 * | 列名         | 类型   | 说明                                  |
 * |--------------|--------|---------------------------------------|
 * | 字段名称     | string | 数据库字段的名称                      |
 * | 字段类型     | string | 数据库字段类型（如 serial, text 等）  |
 * | 是否必填     | string | "是" 或 "否"                          |
 * | 是否唯一     | string | "是" 或 "否"                          |
 * | 备注         | string | 字段备注信息                          |
 *
 * **抛出的错误：**
 * - `数据格式不规范`：行不以 `|` 开头或结尾
 * - `数据长度不一致`：数据行列数与表头不匹配
 * - `数据不足`：数据行数小于等于2（表头+空行）
 *
 * @param mdValue Markdown 格式的数据库字段定义字符串
 * @returns 字段对象数组，每个对象包含字段定义
 * @throws {Error} 当输入格式不正确时抛出错误
 *
 * @example
 * ```ts
 * const mdValue = `
 * |字段名称|字段类型|是否必填|是否唯一|备注|
 * |--------|--------|--------|--------|----|
 * | id     | serial | 是     | 是     | |
 * | name   | text   | 是     | 否     | 姓名|
 * `;
 * // 返回: [
 * //   { 字段名称: "id", 字段类型: "serial", 是否必填: "是", 是否唯一: "是", 备注: "" },
 * //   { 字段名称: "name", 字段类型: "text", 是否必填: "是", 是否唯一: "否", 备注: "姓名" }
 * // ]
 * ```
 */
export function md2obj(mdValue: string): Array<Record<string, string>> {
  const headers = "|字段名称|字段类型|是否必填|是否唯一|备注|";

  const splitedHeaders = headers.split("|").slice(1, -1);
  console.log(splitedHeaders);

  const columnCount = countChar(headers, "|");
  const mdArr = mdValue
    // 切割数据
    .split("\n")
    // 移除首尾空格
    .map((v) => {
      const trimedValue = v.trim();
      if (trimedValue === "") {
        return trimedValue; // 空行先返回
      } else if (trimedValue.startsWith("|") && trimedValue.endsWith("|")) {
        if (countChar(trimedValue, "|") !== columnCount) {
          throw new Error("数据长度不一致");
        }
        return trimedValue;
      } else {
        // 没有以'|'开头或结尾
        throw new Error("数据格式不规范");
      }
    })
    // 过滤空行
    .filter(Boolean);

  if (mdArr.length <= 2) {
    throw new Error("数据不足");
  }

  // Process the data into objects
  const result = [];
  for (let i = 2; i < mdArr.length; i++) {
    const row = mdArr[i];
    const values = row.split("|").slice(1, -1);
    const obj: Record<string, string> = {};

    splitedHeaders.forEach((header, index) => {
      obj[header] = values[index]?.trim() || "";
    });

    result.push(obj);
  }

  return result;
}

export function obj2sql(obj: Record<string, string>) {
  const hasFieldName = "字段名称" in obj;
  if (!hasFieldName) {
    throw new Error("没有字段名称");
  }
  const sql = `${obj["字段名称"]}`;
  return sql;
}

Deno.test("test-md2obj-ok", () => {
  const mdValue = `
  |字段名称|字段类型|是否必填|是否唯一|备注|
  |--------|--------|--------|--------|----|
  | id     | serial | 是     | 是     | |
  | name | text| 是| 否| 姓名|
  |phoneNumber|text|否|否|手机号码|
  `;
  console.log(md2obj(mdValue));
});

Deno.test("test-obj2sql-ok", () => {
  console.log(
    obj2sql({
      字段名称: "phoneNumber",
      字段类型: "text",
      是否必填: "否",
      是否唯一: "否",
      备注: "手机号码",
    }),
  );
});
