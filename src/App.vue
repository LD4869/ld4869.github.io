<template>
  <DateDisplay/>
</template>

<script>
 
import DateDisplay from './components/DateDisplay.vue';

export default {
  name: 'App',
  components: {   
DateDisplay
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<!-- npm i typescript -D
npm i ts-node -D
npm i tyme4ts -->