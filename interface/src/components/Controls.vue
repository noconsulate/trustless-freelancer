<template>
  <div>
    <div class="row">
      <button @click="enableEthereum">enable ethereum!</button>
    </div>
    <div class="row">
      <button @click="callReset">reset</button>
      <button @click="callMarkShipped">mark shipped</button>
      <button @click="callMarkReceived">mark received</button>
    </div>
    <div class="row">
      <input v-model.number="etherAmount" type="number">
      <button @click="callSendPayment">fund escrow</button>
    </div>
  </div>
</template>

<script>
import { reset, getAccount, markShipped, markReceived, sendPayment } from "../services/web3";

export default {
  data() {
    return {
      etherAmount: '2.5',
    }
  },
  methods: {
    //update state after contract calls
    async postCall(res) {
      this.$store.dispatch("fetchValues", null);
      this.$store.dispatch("setTxHash", res);
    },
    async enableEthereum() {
      const account = await getAccount();
      this.$store.dispatch("setAccount", account);
    },
    async callReset() {
      //needs error handling!
      const res = await reset();
      // this.$store.dispatch("fetchValues", null);
      this.postCall(res);
    },
    callMarkShipped() {
      markShipped()
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => {
          console.log(res);
          this.$store.dispatch("fetchValues", null);
        });
    },
    callMarkReceived() {
      markReceived()
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => {
          console.log(res);
          this.$store.dispatch("fetchValues", null);
        });
    },
    callSendPayment() {
      sendPayment(this.etherAmount);
    },
  },
};
</script>

<style scoped>
#row {
  display: grid;
  gap: 1rem;
  grid-auto-flow: comlumn;
}

#appc {
  color: rebeccapurple;
}
</style>
