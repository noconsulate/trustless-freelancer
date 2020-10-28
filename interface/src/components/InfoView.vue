<template>
  <div class="flex flex-col space-y-1">
    <div :class="descriptionClass">current account</div>
    <div v-if="account == null" class="italic" :class="contentClass">{{ 
      NO_ACCOUNT }}</div>
    <div v-else :class="contentClass">{{ account }} </div>
    <div :class="descriptionClass">contract address</div>
    <div :class="contentClass">{{ contractValues.address }}</div>

    <div :class="descriptionClass">contract balance</div>
    <div :class="contentClass">{{ contractValues.balance }} ether</div>
    <div :class="descriptionClass">owner address</div>
    <div :class="contentClass">{{ contractValues.owner }}</div>
    <template v-if="this.$store.state.escrowFetched == true">
      <div :class="descriptionClass">client address</div>
      <div :class="contentClass">{{ escrowValues.address }}</div>
      <div :class="descriptionClass">escrow balance</div>
      <div :class="contentClass">{{ escrowValues.balance }} ether</div>
      <div :class="descriptionClass">shipped?</div>
      <div :class="contentClass">{{ escrowValues.isShipped }}</div>
      <div :class="descriptionClass">received?</div>
      <div :class="contentClass">{{ escrowValues.isReceived }}</div>
    </template>
    <template v-else>
      <div :class="descriptionClass">client address</div>
      <div class="italic" :class="contentClass">{{ NO_ESCROW }}</div>
      <div :class="descriptionClass">escrow balance</div>
      <div class="italic" :class="contentClass">{{ NO_ESCROW }}</div>
      <div :class="descriptionClass">shipped?</div>
      <div class="italic" :class="contentClass">{{ NO_ESCROW }}</div>
      <div :class="descriptionClass">received?</div>
      <div class="italic" :class="contentClass">{{ NO_ESCROW }}</div>
    </template>
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
    },
    activeContract() {
      return this.$store.state.activeContract;
    }
  },
  data() {
    return {
      descriptionClass: "font-bold bg-gradient-to-r from-gray-400",
      contentClass: "flex items-center text-red-600 h-7 pl-2",

      NO_ESCROW: 'please select a client',
      NO_ACCOUNT: 'please enable ethereum',
    };
  },
  created: async function() {
    this.$store.dispatch('fetchClients')
  },
};
</script>
