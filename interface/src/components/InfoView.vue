<template>
  <div class="flex flex-col space-y-1">
    <div class="description">current account</div>
    <div v-if="account == null" class="italic content">
      {{ NO_ACCOUNT }}
    </div>
    <div v-else class="content">{{ account }}</div>
    <div class="description">contract address</div>
    <div class="content">{{ activeContract }}</div>

    <div class="description">contract balance</div>
    <div class="content">{{ contractValues.balance }} ether</div>
    <div class="description">owner address</div>
    <div class="content">{{ contractValues.owner }}</div>
    <template v-if="this.$store.state.escrowFetched == true">
      <div class="description">client address</div>
      <div class="content">{{ escrowValues.address }}</div>
      <div class="description">escrow balance</div>
      <div class="content">{{ escrowValues.balance }} ether</div>
      <div class="description">shipped?</div>
      <div class="content">{{ escrowValues.isShipped }}</div>
      <div class="description">received?</div>
      <div class="content">{{ escrowValues.isReceived }}</div>
    </template>
    <template v-else>
      <div class="description">client address</div>
      <div class="italic content">{{ NO_ESCROW }}</div>
      <div class="description">escrow balance</div>
      <div class="italic content">{{ NO_ESCROW }}</div>
      <div class="description">shipped?</div>
      <div class="italic content">{{ NO_ESCROW }}</div>
      <div class="description">received?</div>
      <div class="italic content">{{ NO_ESCROW }}</div>
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
    },
  },
  data() {
    return {
      NO_ESCROW: "please select a client",
      NO_ACCOUNT: "please enable ethereum",
    };
  },
};
</script>
