<template>
  <div class="space-y-3">
    <info-view />
    <controls />
    <transaction-view />
    <error-view />
  </div>
</template>

<script>
import { 
  doThing, getAccount, getValues,
  } from "../services/web3.js";
import InfoView from '../components/InfoView'
import Controls from '../components/Controls'
import ErrorView from '../components/ErrorView';
import TransactionView from '../components/TransactionView';
    
export default {
  name: "MerchantView",
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

    this.$store.dispatch('fetchClients', this.$store.state.activeContract);

    this.$store.dispatch('fetchValues', this.$store.state.activeContract);

  },
};
</script>