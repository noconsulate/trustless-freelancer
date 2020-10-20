<template>
  <div>
    <h2>current account</h2>
    <p>{{ account }}</p>
    <h2>contract address</h2>
    <p>{{ contractValues.address }}</p>


    <h2>contract balance</h2>
    <p>{{ contractValues.balance }}</p>
    <h2>owner address</h2>
    <p>{{ contractValues.owner }}</p>
    <h2>client address</h2>
    <p>{{ escrowValues.address }}</p>
    <h2>escrow balance</h2>
    <p>{{ escrowValues.balance }} </p>
    <h2>shipped?</h2>
    <p>{{ escrowValues.isShipped }}</p>
    <h2>received?</h2>
    <p>{{ escrowValues.isReceived }}</p>
  </div>
</template>

<script>
import { getClients } from "../services/web3";

export default {
  computed: {
    contractValues() {
      return this.$store.state.contractValues;
    },
    account() {
      return this.$store.state.account;
    },
    escrowValues() {
      return this.$store.state.escrowValues;
    }
   
  },
  created: async function() {},
};
</script>
