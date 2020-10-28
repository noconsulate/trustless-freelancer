<template>
  <div class="space-y-2">
    <div :class="rowClass">
      <button @click="enableEthereum" :class="buttonClass">
        enable ethereum!
      </button>
    </div>
    <div :class="rowClass">
      <div class="inline-block relative w-64">
        <select
          class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
          v-model="selectedClient"
        >
        <option class="text-sm" disabled value="">select a client</option>
        <option
          class="text-sm"
          v-for="client in clients"
          v-bind:selectedClient="client.address"
          v-bind:key="client.id"
        >
          {{ client.address }}
        </option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
          <svg
            class="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            />
          </svg>
        </div>
      </div>
      <button @click="callGetEscrowValues" :class="buttonClass">
        get escrow
      </button>
    </div>
    <div :class="rowClass">
      <button @click="callReset" :class="buttonClass">reset</button>
      <button :class="buttonClass" @click="callMarkShipped">
        mark shipped
      </button>
      <button @click="callMarkReceived" :class="buttonClass">
        mark received
      </button>
    </div>
    <div :class="rowClass">
      <input v-model.number="etherAmount" type="number" />
      <button @click="callSendPayment" :class="buttonClass">fund escrow</button>
    </div>

    <div :class="rowClass">
      <button @click="callRefund" :class="buttonClass">refund</button>
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
      selectedClient: "",

      buttonClass:
        "bg-gray-400 rounded border border-black shadow-lg hover:bg-gray-600 hover:text-white px-2 py-1",
      rowClass: "flex space-x-2",
    };
  },
  computed: {
    clients() {
      return this.$store.state.clients;
    },
    activeContract() {
      return this.$store.state.activeContract;
    }
  },
  methods: {
    //update state after contract sends
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
     
      const argsObj = {
        client: this.selectedClient,
        contract: this.activeContract,
      }
      // !!!*** I guess I can't send an object and only one argument? hmmm this requires deeb reserch
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
      methodSender("reset", null, this.activeContract)
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

      methodSender("markShipped", this.selectedClient, this.activeContract)
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
      methodSender("markReceived", null, this.activeContract)
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
    },
    callSendPayment() {
      const clients = this.$store.state.clients.map((client) =>
        client.address.toUpperCase()
      );

      if (clients.includes(window.ethereum.selectedAddress.toUpperCase())) {
        alert("this address already has an escrow");
        return;
      }
      sendPayment(this.etherAmount, this.activeContract)
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
    },
    callRefund() {
      if (
        window.ethereum.selectedAddress.toUpperCase() !=
        this.$store.state.contractValues.owner.toUpperCase()
      ) {
        alert("only merchant can refund");
        return;
      }
      methodSender("refund", this.selectedClient, this.activeContract)
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
    },
  },
};
</script>
