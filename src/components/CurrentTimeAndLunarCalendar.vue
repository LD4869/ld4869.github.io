<template>
  <div class="current-time-lunar-calendar">
    <h1>当前时间</h1>
    <p>{{ currentTime }}</p>
    <h1>农历时间</h1>
    <p>{{ currentLunarTime }}</p>
    <h1>干支时间</h1>
    <p>{{ currentTimeGZ }}</p>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 加载中文语言包
import { Solar } from 'lunar-javascript';

export default {
  data() {
    return {
      currentTime: '',
      currentLunarTime: '',
      currentTimeGZ: '',
    };
  },
  created() {
    this.updateTime();
    // 每秒更新一次时间
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      // 获取当前时间并格式化
      const now = dayjs().locale('zh-cn').format('YYYY年MM月DD日 HH:mm:ss');
      this.currentTime = now;

      // 获取农历时间
      const solar = Solar.fromDate(new Date());
      const lunar = solar.getLunar();

      const yearGZ = lunar.getYearInGanZhi();
      const monthGZ = lunar.getMonthInGanZhi();
      const dayGZ = lunar.getDayInGanZhi();
      const hourGZ = lunar.getTimeInGanZhi();
    
      const chineseYear = lunar.getYearInChinese();
      const chineseMonth = lunar.getMonthInChinese();
      const chineseDay = lunar.getDayInChinese();
      this.currentLunarTime = `${chineseYear}年${chineseMonth}月${chineseDay} `;
      this.currentTimeGZ = `${yearGZ}年${monthGZ}月${dayGZ}日${hourGZ}时`;
    },
  },
};
</script>

<style scoped>
.current-time-lunar-calendar {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

p {
  font-size: 24px;
  color: #555;
}
</style>