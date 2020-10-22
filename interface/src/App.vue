<template>
  <div id="app">
    <h1>trustless-freelancer</h1>
    <router-link class="navLink" to="/">
      Owner view
    </router-link>
    <router-link class="navLink" to="/logs">
      logs
    </router-link>
    <router-view></router-view>
    
  </div>
</template>

<script>

export default {
  name: "App",

};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 30px;
}

p {
  margin: 8px;
}

h2 {
  margin: 8px;
}

.navLink {
  margin: 10px;
}
</style>
//
