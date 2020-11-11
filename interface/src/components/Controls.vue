<template>
  <div class="space-y-1 pt-2">
    <div :class="rowClass">
      <div class="inline-block relative w-64">
        <select
          class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
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
      <button @click="callGetEscrowValues" class="btn flex-grow">
        get escrow
      </button>
    </div>
    <div :class="rowClass">
      <button class="btn w-1/3" @click="callMarkShipped">
        mark shipped
      </button>
      <button @click="callMarkReceived" class="btn w-1/3">
        mark received
      </button>
      <button @click="callRefund" class="btn w-1/3">refund</button>
    </div>
    <div :class="rowClass">
      <input v-model.number="tokenAmount" type="number" />
      <button @click="callApproveAndTransferFrom" class="btn">
        fund escrow
      </button>
    </div>

    <div :class="rowClass">
      <button @click="callReset" class="btn">reset</button>

      <button class="btn" @click="refresh">refresh</button>
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
      selectedClient: "",
      tokenAmount: "0.001",

      buttonClass:
        "bg-gray-400 rounded border border-black shadow-lg hover:bg-gray-600 hover:text-white px-2 py-1",
      rowClass: "flex space-x-1",
    };
  },
  computed: {
    clients() {
      return this.$store.state.clients;
    },
    activeContract() {
      return this.$store.state.activeContract;
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
