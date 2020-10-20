<template>
  <div>
    <div class="row">
      <button @click="enableEthereum">enable ethereum!</button>
    </div>
    <div class="row">
      <select v-model="selectedClient">
        <option disabled value="">select a client</option>
        <option
          v-for="client in clients"
          v-bind:selectedClient="client.address"
          v-bind:key="client.id"
        >
          {{ client.address }}
        </option>
      </select>
      <button @click="callGetEscrowValues" class="item">get escrow</button>
    </div>
    <div class="row">
      <button @click="callReset" class="item">reset</button>
      <button class="item" @click="callMarkShipped">mark shipped</button>
      <button @click="callMarkReceived">mark received</button>
    </div>
    <div class="row">
      <input v-model.number="etherAmount" type="number" />
      <button @click="callSendPayment">fund escrow</button>
    </div>

    <div class="row">
      <button @click="callDisperse">disperse</button>
      <button @click="callRefund">refund</button>
    </div>
  </div>
</template>

<script>
import {
  awaitTxMined,
  sendPayment,
  methodSender,
  getEscrowValues,
} from "../services/web3";

export default {
  data() {
    return {
      etherAmount: "0.05",
      selectedClient: "0x3844f4d66EFC4b1441c94DB409dB0521cb718e56",
    };
  },
  computed: {
    clients() {
      return this.$store.state.clients;
    },
  },
  methods: {
    //update state after contract calls
    async postCall(txHash) {
      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      console.log(receipt);
      this.$store.dispatch("fetchValues", null);
    },
    async enableEthereum() {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.$store.dispatch("setAccount", accounts[0]);
    },
    async callGetEscrowValues() {
      this.$store.dispatch("fetchEscrowValues", this.selectedClient);
    },
    callReset() {
      //only owner can reset
      if (
        window.ethereum.selectedAddress.toUpperCase() !=
        this.$store.state.contractValues.owner.toUpperCase() ||
        window.ethereum.selectedAddress == null
      ) {
        alert("only the admin can reset");
        return;
      }
      methodSender("reset")
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
    },
    callMarkShipped() {
      //only merchant can mark shipped
      if (
        window.ethereum.selectedAddress.toUpperCase() !=
        this.$store.state.contractValues.owner.toUpperCase()
      ) {
        alert("only the merchant can mark shipped");
        return;
      }

      methodSender("markShipped", this.selectedClient)
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
    },
    callMarkReceived() {
      // only client can mark received
      if (
        window.ethereum.selectedAddress.toUpperCase() !=
        this.$store.state.escrowValues.address.toUpperCase()
      ) {
        alert("only client can mark shipped!");
        return;
      }
      methodSender("markReceived")
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
    },
    callSendPayment() {
      if (
        this.$store.state.contractValues.client !=
        "0x0000000000000000000000000000000000000000"
      ) {
        alert("the escrow is already paid");
        return;
      }
      sendPayment(this.etherAmount)
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
    },

    callDisperse() {
      // product must be shipped and received
      if (
        this.$store.state.contractValues.isShipped == true &&
        this.$store.state.contractValues.isReceived == true
      ) {
        methodSender("disperse")
          .catch((e) => this.$store.dispatch("setError", e.code))
          .then((res) => this.postCall(res));
      } else {
        alert("product must be marked shipped and received to disperse!");
      }
    },
    callRefund() {
      if (
        window.ethereum.selectedAddress.toUpperCase() !=
        this.$store.state.contractValues.merchant.toUpperCase()
      ) {
        alert("only merchant can refund");
        return;
      }
      methodSender("refund")
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
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
