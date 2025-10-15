import { assertEquals } from "@std/assert";

/** 寻找中间坐标 */
function findMiddleIndex(nums: number[]): number {
  let rightSum = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    if (rightSum - num === leftSum) {
      // 左侧之和 = 右侧之和, 返回下标
      return i;
    } else {
      // 左侧之和 加上当前值
      leftSum += num;
      // 右侧之和 减去当前值
      rightSum -= num;
    }
  }
  // 没有找到中间坐标时, 返回-1;
  return -1;
}
Deno.test("test-4", () => {
  const res = findMiddleIndex([2, 3, -1, 8, 4]);
  console.log("res:", res);
  assertEquals(res, 3);
});

Deno.test("test-3", () => {
  const res = findMiddleIndex([1, -1, 4]);
  console.log("res:", res);
  assertEquals(res, 2);
});

Deno.test("test-2", () => {
  const res = findMiddleIndex([2, 5]);
  console.log("res:", res);
  assertEquals(res, -1);
});

Deno.test("test-1", () => {
  const res = findMiddleIndex([1]);
  console.log("res:", res);
  assertEquals(res, 0);
});
