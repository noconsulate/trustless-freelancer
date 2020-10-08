<template>
  <div id="app">
    <h2>trustless-freelancer</h2>
    <button @click="initThing">enable ethereum</button>
    <h2>current account</h2>
    {{ account }}
  </div>
</template>

<script>
import { doThing, getAccount } from './services/web3.js'

export default {
  name: "App",
  components: {
    
  },
  computed: {

  },
  data() {
    return {
      account: '',
    }
  },
  methods: {
    async initThing() {
      doThing();
      this.account = await getAccount();
    }
  },
  created: async function() {
  
  }
}
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
</style>
//