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

/**
 * 格式化日期对象为指定格式的字符串
 * @param params 格式化参数
 * @param params.inputDate 要格式化的日期对象，默认为当前时间
 * @param params.separator 自定义分隔符，未指定时返回ISO格式(YYYY-MM-DDTHH:mm:ss)
 * @returns 包含三种格式的对象:
 *          fullDateFormat - 完整日期时间格式
 *          dateFormat - 仅日期部分
 *          timeFormat - 仅时间部分
 */
export function formatDate(params: {
  /** 要格式化的日期对象   */
  inputDate?: Date;
  /** 自定义分隔符   */
  separator?: string;
}): {
  fullDateFormat: string;
  dateFormat: string;
  timeFormat: string;
} {
  const { inputDate = new Date(), separator } = params;
  const { year, month, day, hour, minute, second } = parseDate(inputDate);

  const dateFormat = [
    year,
    month.toString().padStart(2, "0"),
    day.toString().padStart(2, "0"),
  ].join(separator ?? "-");
  const timeFormat = [
    hour.toString().padStart(2, "0"),
    minute.toString().padStart(2, "0"),
    second.toString().padStart(2, "0"),
  ].join(separator ?? ":");
  console.log(`${dateFormat}T${timeFormat}`);

  return {
    fullDateFormat:
      separator !== undefined
        ? [dateFormat, timeFormat].join(separator)
        : `${dateFormat}T${timeFormat}`,
    dateFormat,
    timeFormat,
  };
}
