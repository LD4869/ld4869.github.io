/**
 * 将蛇形命名法(snake_case)转换为驼峰命名法(camelCase)
 * @param snakeStr - 蛇形字符串，如 "spu_id"
 * @returns 驼峰字符串，如 "spuID"
 */
function snakeToCamel(snakeStr: string): string {
    if (typeof snakeStr !== 'string') {
        throw new Error('Input must be a string');
    }

    return snakeStr.replace(/_id\b/g, 'ID').replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

// 测试用例
console.log(snakeToCamel('spu_id'));     // 输出: spuID
console.log(snakeToCamel('spu_name'));   // 输出: spuName
console.log(snakeToCamel('user_ident')); // 输出: userIdent
console.log(snakeToCamel('user_id'));    // 输出: userId
console.log(snakeToCamel('first_name')); // 输出: firstName
console.log(snakeToCamel('a_b_c'));      // 输出: aBC

// 导出函数
export default snakeToCamel;

// 也可以作为命名导出
export { snakeToCamel };