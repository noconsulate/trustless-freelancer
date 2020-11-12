<template>
  <div class="space-y-1 ">
    <div :class="rowClass" class="justify-center">
      <button @click="callRefund" class="btn flex-1">refund</button>

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
  },
  methods: {
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
    async enableEthereum() {
      // is this necessary?
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.$store.dispatch("setAccount", accounts[0]);
      if (window.ethereum.chainId !== "0x539") {
        alert("please switch Metamask to the correct chain");
      }
    },
    async callGetEscrowValues() {
      const argsObj = {
        client: this.selectedClient,
        contract: this.activeContract,
      };
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
    callSendTokens() {
      // do allowance on token from sender to freelancer,
      // then do transferFrom() on freelancer
      sendTokens("1", this.activeContract)
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
    },
    async callApproveAndTransferFrom() {
      // check client doesn't already have an escrow
      let clientExists = false;
      this.clients.map((item) => {
        item.address.toUpperCase() ==
        window.ethereum.selectedAddress.toUpperCase()
          ? (clientExists = true)
          : null;
      });
      if (clientExists) {
        alert("client exists");
        return;
      }

      // check sender has enough balance
      let balance = await checkBalance(window.ethereum.selectedAddress);
      console.log(balance > this.tokenAmount);
      if (balance < this.tokenAmount) {
        alert("this account doesn't have enough tokens to proceed");
        return;
      }

      let txHash;

      try {
        txHash = await sendApprove(this.activeContract, this.tokenAmount);
      } catch (e) {
        console.log(e);
      }
      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      console.log("confirmed");

      // check that sender=>spender has allwoance
      const allowance = await checkAllowance(this.activeContract);
      if (allowance < this.tokenAmount) {
        alert("something went wrong and there isn't enough token alowance");
        return;
      }

      try {
        txHash = await methodSender(
          "transferFrom",
          this.tokenAmount,
          this.activeContract
        );
      } catch (e) {
        console.log(e);
        this.$store.dispatch("setError", e.code);
      }

      this.postCall(txHash);
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
  },
};
</script>
