<template>
  <div id="app">
    <h1>trustless-freelancer</h1>
    <info-view />
    <controls />
    <transaction-view />
    <error-view />
  </div>
</template>

<script>
import { 
  doThing, getAccount, getValues,
  } from "./services/web3.js";
import InfoView from './components/InfoView'
import Controls from './components/Controls'
import ErrorView from './components/ErrorView';
import TransactionView from './components/TransactionView';
    
export default {
  name: "App",
  components: {
    'info-view': InfoView,
    'controls': Controls,
    'error-view': ErrorView,
    'transaction-view': TransactionView,
  },
  computed: {
    account() {
      return this.$store.state.account;
    }
  },
  data() {
    return {
      // account: "",
    };
  },
  methods: {
  },
  created: async function() {
    if (window.ethereum == undefined) {
      alert('sorry, you need metamask to use this app')
    }
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

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

p {
  margin: 8px;
}

h2 {
  margin: 8px;
}
</style>
//
