<template>
  <div id="app">
    <NavBar />
    <router-view />
    <MyFootBar />     
  </div>
</template>
y
<script>
import NavBar from './components/MyBar.vue'
 import MyFootBar from './components/MyFootBar.vue'

export default {
  components: {
    NavBar,
     MyFootBar      
  }
}
</script>

<style>
body {
  margin: 0;
  background-color: #1a1a1a;
}
#app {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.footer-bar {
  width: 100%;
}

</style>
