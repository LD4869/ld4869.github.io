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
  debug: (conn: any, query: any, params: any[]) => {
    console.log(`conn: ${conn}`);
    console.log(`SQL: ${query}`);
    if (params && params.length > 0) {
      console.log(`PARAMS: ${JSON.stringify(params)}`);
    }
    console.log('%c---end---');
  },
} as any; // 使用类型断言避免TypeScript错误

*/
