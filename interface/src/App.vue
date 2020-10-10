<template>
  <div id="app">
    <h1>trustless-freelancer</h1>
    <button @click="initThing">enable ethereum</button>
    <h2>current account</h2>
    {{ account }}
    <info-view />
    <controls />
  </div>
</template>

<script>
import { doThing, getAccount, getValues } from "./services/web3.js";
import InfoView from './components/InfoView'
import Controls from './components/Controls'
    
export default {
  name: "App",
  components: {
    'info-view': InfoView,
    'controls': Controls,
  },
  computed: {
    
  },
  data() {
    return {
      account: "",
    };
  },
  methods: {
    async initThing() {
      this.account = await getAccount();
    },
  },
  created: async function() {
    window.ethereum.on("accountsChanged", function(accounts) {
      console.log("acocunt changed (inside App.vue)", accounts);
    });

    this.$store.dispatch('fetchValues', null);
  },
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
</style>
//
