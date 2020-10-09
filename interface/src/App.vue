<template>
  <div id="app">
    <h1>trustless-freelancer</h1>
    <button @click="initThing">enable ethereum</button>
    <h2>current account</h2>
    {{ account }}
    <info-view />
  </div>
</template>

<script>
import { doThing, getAccount, getValues } from "./services/web3.js";
import InfoView from './components/InfoView'
    
export default {
  name: "App",
  components: {
    'info-view': InfoView,
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

    const values = await getValues();
    this.$store.dispatch('updateFields', values);
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
