<template>
  <div class="flex flex-col space-y-1">
    <div :class="descriptionClass">current account</div>
    <div :class="contentClass">{{ account }}</div>
    <div :class="descriptionClass">contract address</div>
    <div :class="contentClass">{{ contractValues.address }}</div>


    <div :class="descriptionClass">contract balance</div>
    <div :class="contentClass">{{ contractValues.balance }} ether</div>
    <div :class="descriptionClass">owner address</div>
    <div :class="contentClass">{{ contractValues.owner }}</div>
    <div :class="descriptionClass">client address</div>
    <div :class="contentClass">{{ escrowValues.address }}</div>
    <div :class="descriptionClass">escrow balance</div>
    <div :class="contentClass">{{ escrowValues.balance }} ether</div>
    <div :class="descriptionClass">shipped?</div>
    <div :class="contentClass">{{ escrowValues.isShipped }}</div>
    <div :class="descriptionClass">received?</div>
    <div :class="contentClass">{{ escrowValues.isReceived }}</div>
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
  data () {
    return {
      descriptionClass: "text-lg font-bold bg-gradient-to-r from-gray-400",
      contentClass: "flex items-center text-red-600 text-sm h-5 pl-2"
    }
  },
  created: async function() {},
};
</script>


