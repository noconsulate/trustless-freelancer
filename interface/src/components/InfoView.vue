<template>
  <div>
    <h2>current account</h2>
      <p>{{ account }}</p>
    <h2>contract address</h2>
    <p>{{ contractValues.address }}</p>
    <h2>client accounts</h2>
    {{this.clients}}
    <h2>contract balance</h2>
    <p>{{ contractValues.balance }}</p>
    <h2>admin address</h2>
    <p>{{ contractValues.admin }}</p>
    <h2>merchant address</h2>
    <p>{{ contractValues.merchant }}</p>
    <h2>client address</h2>
   <p> {{ contractValues.client }}</p>
    <h2>shipped?</h2>
   <p> {{ contractValues.isShipped }}</p>
    <h2>received?</h2>
  <p>  {{ contractValues.isReceived }}</p>
  </div>
</template>

<script>
import { getClients } from '../services/web3'

export default {
  data() {
    return {
      clients: [],
    };
  },
  computed: {
    contractValues() {
      return this.$store.state.contractValues;
    },
    account() {
      return this.$store.state.account;
      
    }
  },
  created: async function() {
    const clients = await getClients();
    this.clients = clients;
  }
}
</script>