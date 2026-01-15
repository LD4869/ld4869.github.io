/*
export const pgConfig: Parameters<typeof postgres>[1] = {
  transform: {
    ...postgres.camel,
    column: {
      to: toSQLColumn,
      from: toJSProperty,
    },
  },
  types: {
    bigint: postgres.BigInt,
  },
  connection: {
    application_name: 'z1-deno',
  },
   // 添加日志配置 - 适用于postgresjs v3.4.5
  debug: (conn: number, query: string, params: SerializableParameter[]) => {
    console.log(`conn: ${conn}`);
    console.log(`SQL: ${query}`);
    if (params && params.length > 0) {
      console.log(
        `PARAMS: \n${
          params.map((param, index) =>
            `$${index + 1}=> ${JSON.stringify(param)}`
          )
            .join('\n')
        }`,
      );
    }
    console.log('%c---end---', 'color: red');
  },
} as any; // 使用类型断言避免TypeScript错误

*/
