<template>
  <div class="space-y-1 ">
    <div :class="rowClass" class="justify-center">
      <button @click="callRefund" class="btn flex-1">refund</button>
      <button @click="callCancel" class="btn flex-1">cancel recurring</button>
      <button @click="callReset" class="btn flex-1">reset</button>

      <button class="btn flex-1" @click="refresh">refresh</button>
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
import { sendApprove, checkBalance, checkAllowance } from "../services/token";

export default {
  data() {
    return {
      tokenAmount: "0.001",

      buttonClass:
        "bg-gray-400 rounded border border-black shadow-lg hover:bg-gray-600 hover:text-white px-2 py-1",
      rowClass: "flex items-center space-x-1",
    };
  },
  computed: {
    clients() {
      return this.$store.state.clients;
    },
    activeContract() {
      return this.$store.state.activeContract;
    },
    selectedClient() {
      return this.$store.state.selectedClient;
    },
    selectedClientAddress() {
      clients = this.$store.state.clientDetails;
      console.log(clients);
      let result;

      clients.map((client) => {
        client.name = this.selectedClient ? (result = client.address) : null;
      });

      return result;
    },
    clientDetails() {
      return this.$store.state.clientDetails;
    },
  },
  methods: {
    getSelectedClientAddress() {
      let address;

      this.clientDetails.map((client) => {
        if ((client.name = this.selectedClient)) {
          address = client.address;
        }
      });

      console.log(address);
      return address;
    },
    //update state after contract sends
    async postCall(txHash) {
      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      console.log("confirmed");
      this.$store.dispatch("fetchValues");
      this.$store.dispatch("fetchClients");
    },
    // dispatchSetAccount(account) {
    //   this.$store.dispatch("setAccount", account);
    // },

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
    callRefund() {
      let address = this.getSelectedClientAddress();
      if (
        window.ethereum.selectedAddress.toUpperCase() !=
        this.$store.state.contractValues.owner.toUpperCase()
      ) {
        alert("only merchant can refund");
        return;
      }
      methodSender("refund", address, this.activeContract)
        .catch((e) => this.$store.dispatch("setError", e.code))
        .then((res) => this.postCall(res));
    },
    callSendTokens() {
      // do allowance on token from sender to freelancer,
      // then do transferFrom() on freelancer
      sendTokens("1", this.activeContract)
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
    },

    async refresh() {
      this.$store.dispatch("fetchValues");
      this.$store.dispatch("fetchClients");

      console.log(this.clients);
      if (this.clients.length > 0 && this.selectedClient != "") {
        console.log("??");
        this.$store.dispatch("fetchEscrowValues", this.selectedClient);
      } else {
        this.$store.dispatch("resetEscrow");
      }
    },

    async callCancel() {
      const address = this.getSelectedClientAddress();
      try {
        txHash = await methodSender("cancel", address, this.activeContract);
      } catch (e) {
        this.$store.dispatch("setError", e.clode);
      }
      this.postCall(txHash);
    },
  },
};
</script>
