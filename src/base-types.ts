/**
 * 对象类型
 */
export type ObjectType = {
  [key: string]:
    | string
    | number
    | boolean
    | ObjectType
    | ObjectType[]
    | null
    | undefined
    | string[]
    | number[]
    | boolean;
};
