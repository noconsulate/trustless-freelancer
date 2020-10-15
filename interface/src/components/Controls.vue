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
    <div class="row">
      <input v-model="merchant" type="text">
      <button @click="callSetMerchant">set merchant</button>
    </div>
    <div class="row">
      <button @click="callDisperse">disperse</button>
      <button @click="callRefund">refund</button>
    </div>
  </div>
</template>

<script>
import { awaitTxMined, reset, getAccount, markShipped, markReceived, sendPayment, setMerchant, methodSender } from "../services/web3";

export default {
  data() {
    return {
      etherAmount: '0.05',
      merchant: '0xFa2cf442D4EcfeC527cB740bF842f7E68D55Cef7'
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
          this.postCall(res);
        });
    },
    callMarkReceived() {
      markReceived()
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => {
          this.postCall(res);
        });
    },
    callSendPayment() {
      sendPayment(this.etherAmount)
        .catch(e => this.$store.dispatch('setError', e.code))
        .then(res => this.postCall(res));
    },
    callSetMerchant() {
      setMerchant(this.merchant)
        .catch(e => this.$store.dispatch('setError', e.code))
        .then(res => this.postCall(res));
    },
    callDisperse() {
      // product must be shipped and received
      if (this.$store.state.contractValues.isShipped == true && this.$store.state.contractValues.isReceived == true) {
        methodSender('disperse')
          .catch(e => this.$store.dispatch('setError', e.code))
          .then(res => this.postCall(res));
      } else {
        alert('product must be marked shipped and received to disperse!')
      }
    },
    callRefund() {
      alert('sup')
    }
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
