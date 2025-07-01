/**
 * 解析日期对象，返回包含日期各个组成部分的对象
 *
 * @param date - 可选，要解析的日期对象，默认为当前时间
 * @returns 返回包含以下属性的对象:
 *   - date: 原始日期对象
 *   - millisecondTimestamp: 毫秒级时间戳
 *   - secondTimestamp: 秒级时间戳
 *   - year: 年份
 *   - month: 月份(1-12)
 *   - day: 日
 *   - hour: 小时
 *   - minute: 分钟
 *   - second: 秒
 *   - dayInWeek: 星期几(1-7)
 *   - timezoneOffset: 时区偏移量(小时)
 */
export function parseDate(date?: Date) {
  date = date ?? new Date();

  const millisecondTimestamp = date.getTime();

  const year = date.getFullYear();

  const month = date.getMonth() + 1;

  const day = date.getDate();

  const hour = date.getHours();

  const minute = date.getMinutes();

  const second = date.getSeconds();

  const dayInWeek = date.getDay();

  const timezoneOffset = date.getTimezoneOffset();

  return {
    /** 日期 */
    date,
    /** 时间戳(级别: 毫秒) */
    millisecondTimestamp,
    /** 时间戳(级别: 秒) */
    secondTimestamp: millisecondTimestamp / 1000,
    /** 年 */
    year,
    /** 月(自然月, 1-12) */
    month,
    /** 日 */
    day,
    /** 时 */
    hour,
    /** 分 */
    minute,
    /** 秒 */
    second,
    /** 星期几  1-7  */
    dayInWeek: dayInWeek === 0 ? 7 : dayInWeek,
    /** 时区偏移量(级别: 小时) */
    timezoneOffset: timezoneOffset / 60,
  };
}
