<template>
  <div>
    <div class="row">
      <button @click="enableEthereum">enable ethereum!</button>
    </div>
    <div class="row">
      <button @click="callReset" class="item">reset</button>
      <button class="item" @click="callMarkShipped">mark shipped</button>
      <button @click="callMarkReceived">mark received</button>
    </div>
    <div class="row">
      <input v-model.number="etherAmount" type="number">
      <button @click="callSendPayment">fund escrow</button>
    </div>
  </div>
</template>

<script>
import { awaitTxMined, reset, getAccount, markShipped, markReceived, sendPayment } from "../services/web3";

export default {
  data() {
    return {
      etherAmount: '0.05',
    }
  },
  methods: {
    //update state after contract calls
    async postCall(txHash) {
      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      console.log(receipt);
      this.$store.dispatch('fetchValues', null);
    },
    async enableEthereum() {
      const account = await getAccount();
      this.$store.dispatch("setAccount", account);
    },
    callReset() {
      reset()
        .catch(e => this.$store.dispatch('setError', e.code))
        .then(res => this.postCall(res));
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
.row {
  margin-top: 5px;
}

button {
  margin-right: 6px;
}

input {
  margin-right: 6px;
}




</style>
