<template>
  <div class="flex justify-center">
    <div class="w-2/3 bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h2 class="text-xl leading-6 font-medium text-gray-900">
          Client dashboard
        </h2>
        <p class="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
          <template v-if="activeContract">
            Client interaction for contract <br />
            <div class="font-bold">{{ contractName }}</div>

            at<br />
            <div class="font-bold">{{ activeContract }}</div>
          </template>
          <template v-else>
            Enter the address for a trustless-freelancer smart contract
          </template>
        </p>
      </div>
      <div>
        <dl>
          <div
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Contract address
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2 "
            >
              <div class="w-full ``` flex">
                <input
                  v-model="addressInput"
                  placeholder="enter address"
                  class="block appearance-none w-4/5 bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                />
                <button class="btn w-1/5" @click="manualSetContract">
                  set
                </button>
              </div>
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Your escrow
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              <div v-if="clientBalance > 0" class="flex w-full space-x-1">
                <div class="w-3/4">
                  {{ clientBalance }}
                </div>
              </div>
              <div v-else class="flex w-full space-x-1 italic">
                <div class="w-3/4">
                  There is no escrow between this contract and your current
                  Ethereum address.
                </div>
              </div>
            </dd>
          </div>
          <div
            v-if="this.clientBalance == 0"
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Send escrow
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2 "
            >
              <div class="flex flex-col">
                Enter your name
                <div class="w-full ``` flex">
                  <input
                    v-model="clientName"
                    placeholder="enter your name"
                    class="block appearance-none w-3/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                  <button class="btn w-1/4" @click="callApproveAndTransferFrom">
                    set
                  </button>
                </div>
                Enter an amount to send
                <div class="w-full ``` flex">
                  <input
                    v-model="tokenAmount"
                    placeholder="enter amount to send"
                    class="block appearance-none w-3/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                  <button class="btn w-1/4" @click="callApproveAndTransferFrom">
                    set
                  </button>
                </div>
              </div>
            </dd>
          </div>
          <div
            v-else
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Received?
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              <checkbox :isTrue="isReceived" :sendTx="callMarkReceived" />
            </dd>
          </div>
        </dl>
      </div>
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

import Checkbox from "../components/elements/Checkbox";
export default {
  name: "ClientView",
  components: {
    checkbox: Checkbox,
  },
  data() {
    return {
      addressInput: "0x23096c54bc7672f5e41a79fa3e8f8f9a34dac4de",
      clientName: "sam sammnings",
      tokenAmount: 0.1,
      clientBalance: null,
      isReceived: null,
    };
  },
  computed: {
    activeAccount() {
      return this.$store.state.account;
    },
    activeContract() {
      return this.$store.state.activeContract;
    },
    contractName() {
      return this.$store.state.contractValues.name;
    },
    clients() {
      return this.$store.state.clients;
    },
    hasEscrow() {
      let exists = false;
      if (!this.clients) {
        return exists;
      }
      this.clients.map((item) => {
        item.address.toUpperCase() ==
        window.ethereum.selectedAddress.toUpperCase()
          ? (exists = true)
          : null;
      });
      return exists;
    },
    // clientBalance() {
    //   return this.$store.state.escrowValues.balance;
    // },
  },
  methods: {
    async manualSetContract() {
      await this.$store.dispatch("manualSetContract", this.addressInput);

      if (this.activeContract != null && this.activeContract != 0) {
        this.$store.dispatch("fetchClients", this.$store.state.activeContract);
        this.$store.dispatch("fetchValues", this.$store.state.activeContract);
      }
    },
    async callGetEscrowValues() {
      // this.$store.dispatch(
      //   "fetchEscrowValues",
      //   window.ethereum.selectedAddress
      // );

      let clientValues = await getEscrowValues(
        window.ethereum.selectedAddress,
        this.activeContract
      );

      this.clientBalance = clientValues.balance;
      this.isReceived = clientValues.isReceived;
    },
    async postCall(txHash) {
      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      this.callGetEscrowValues();
    },
    async callApproveAndTransferFrom() {
      // check client doesn't already have an escrow
      let clientExists = false;
      console.log(this.clients.length);
      if (this.clients.length > 0) {
        this.clients.map((item) => {
          item.address.toUpperCase() ==
          window.ethereum.selectedAddress.toUpperCase()
            ? (clientExists = true)
            : null;
        });
      }

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

      const arg = {
        tokenAmount: this.tokenAmount,
        clientName: this.clientName,
      };

      try {
        txHash = await methodSender("transferFrom", arg, this.activeContract);
      } catch (e) {
        console.log(e);
        this.$store.dispatch("setError", e.code);
      }

      this.postCall(txHash);
    },
    async callMarkReceived() {
      let txHash;

      try {
        txHash = await methodSender("markReceived", null, this.activeContract);
      } catch (e) {
        this.$store.dispatch("setError", e.code);
      }

      this.postCall(txHash);
    },
  },
  created() {
    this.callGetEscrowValues();
  },
  watch: {
    activeAccount: function() {
      this.callGetEscrowValues();
    },
  },
};
</script>
