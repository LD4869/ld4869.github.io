<template>
  <div class="chinese-style-container">
    <div class="title-decoration">
      <h1 class="chinese-title">公历日期</h1>
      <div class="decoration-element"></div>
    </div>
    <p class="date-content">{{ solarDate }}</p>

    <div class="title-decoration">
      <h1 class="chinese-title">农历日期</h1>
      <div class="decoration-element"></div>
    </div>
    <p class="date-content">{{ lunarDate }}</p>

    <div class="title-decoration">
      <h1 class="chinese-title">干支纪年</h1>
      <div class="decoration-element"></div>
    </div>
    <p class="date-content">{{ sexagenaryCycle }}</p>
  </div>
</template>

<script>
  import { Solar } from "lunar-javascript";

  export default {
    name: "DateDisplay",
    data() {
      return {
        solarDate: "",
        lunarDate: "",
        sexagenaryCycle: "",
      };
    },
    mounted() {
      this.loop();
    },
    methods: {
      updateDate() {
        const now = new Date();

        const solar = Solar.fromDate(now);

        const lunar = solar.getLunar();

        /** 公历日期 例: 2021年01月01日 12:00:00 */
        this.solarDate = `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${now.getHours()}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        /** 农历日期 例: 2021年01月01日 丑时 */
        this.lunarDate = `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月 ${lunar.getDayInChinese()} ${lunar.getTimeZhi()}时`;
        /** 干支纪年 例: @todo */
        this.sexagenaryCycle = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日 ${lunar.getTimeZhi()}时`;
      },

      loop() {
        this.updateDate();
        setTimeout(this.loop, 1000);
      },
    },
  };
</script>

<style scoped>
  .chinese-style-container {
    font-family: "SimSun", "KaiTi", serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5dc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .chinese-title {
    color: #8b4513;
    text-align: center;
    margin-bottom: 5px;
    font-size: 24px;
    font-weight: normal;
  }

  .title-decoration {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
  }

  .decoration-element {
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, #8b4513, transparent);
    margin-top: 5px;
  }

  .date-content {
    text-align: center;
    font-size: 20px;
    color: #000;
    margin: 10px 0;
    line-height: 1.6;
  }

  /* 添加一些传统的中式边框和背景 */
  .chinese-style-container:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(to right, #bb4513, #cd853f);
    z-index: -1;
  }

  .chinese-style-container:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(to right, #cd853f, #8b4513);
    z-index: -1;
  }
</style>
