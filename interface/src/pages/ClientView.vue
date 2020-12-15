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
              <div
                v-if="clientValues.balance > 0"
                class="flex w-full space-x-1"
              >
                <div class="w-3/4">
                  {{ clientValues.balance }}
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
            v-if="this.clientValues.balance == 0"
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Send escrow
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2 "
            >
              <div class="flex flex-col space-y-1">
                <div>
                  <button class="btn" @click="approveMax">
                    Approve max
                  </button>
                  <button class="btn" @click="approveZero">
                    Approve zero
                  </button>
                </div>
                <div>allowance: {{ allowance }}</div>

                Enter your name
                <div class="w-full ``` flex">
                  <input
                    v-model="clientName"
                    placeholder="enter your name"
                    class="block appearance-none w-3/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                </div>
                Enter an amount to send
                <div class="w-full ``` flex">
                  <input
                    v-model="tokenAmount"
                    placeholder="enter amount to send"
                    class="block appearance-none w-3/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                </div>
                Length in days
                <div class="w-full ``` flex">
                  <input
                    v-model="termLength"
                    placeholder="enter number of days"
                    class="block appearance-none w-3/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                  <button class="btn w-1/4" @click="callTransferFrom">
                    set
                  </button>
                </div>
                Recurring?
                <div class="w-full flex font-bold">
                  THERE SHOULD BE A YES/NO OPTION HERE
                </div>
              </div>
            </dd>
          </div>

          <div
            v-if="clientValues.startTime != 0"
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Start date
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              <div class="flex w-full space-x-1">
                <div class="w-3/4">
                  {{ startTime }}
                </div>
              </div>
            </dd>
          </div>
          <div
            v-if="clientValues.endTime != 0"
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              End date?
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {{ endTime }}
            </dd>
          </div>
          <div
            v-if="clientValues.endTime != 0"
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Now
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {{ nowTime }}
            </dd>
          </div>
          difference {{ difference }}
          <button @click="callCancel" class="btn">cancel recurring</button>
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
import BigNumber from "bignumber.js";
import { DateTime } from "luxon";
import { sendApprove, checkBalance, checkAllowance } from "../services/token";

// for experiemnt
window.date = DateTime;

import Checkbox from "../components/elements/Checkbox";
export default {
  name: "ClientView",
  components: {
    checkbox: Checkbox,
  },
  data() {
    return {
      addressInput: null,
      clientName: null,
      tokenAmount: null,
      termLength: null,
      recurring: null,
      clientValues: { balance: null },
      allowance: null,
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
    startTime() {
      const startMillis =
        Number(this.clientValues.endTime) - this.clientValues.term;

      const dt = DateTime.fromMillis(startMillis);

      return dt.toLocaleString();
    },
    endTime() {
      const dt = DateTime.fromMillis(Number(this.clientValues.endTime));

      return dt.toLocaleString();
    },
    nowTime() {
      const dt = DateTime.local();

      return dt.toLocaleString();
    },
    difference() {
      const end = DateTime.fromMillis(Number(this.clientValues.endTime));
      const diff = end.diffNow("days");

      return diff.toObject().days;
    },
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

      console.log(clientValues);

      // if (clientValues.startTime != 0) {
      //   clientValues.startTime = new DateTime(Number(clientValues.startTime));
      //   clientValues.endTime = new DateTime(Number(clientValues.endTime));
      // }

      this.clientValues = clientValues;
    },
    async postCall(txHash) {
      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      this.callGetEscrowValues();
      this.getAllowance();
    },
    async getAllowance() {
      const allowance = await checkAllowance(this.activeContract);

      this.allowance = allowance;
    },
    async approveMax() {
      const maxToken = await new BigNumber((2 ** 256 - 1) / 10 ** 18);
      console.log(maxToken);

      // danger danger this isn't real
      // need to figure out why BN isn't working on server

      let txHash;

      try {
        txHash = await sendApprove(this.activeContract, 1000000);
      } catch (e) {
        console.log(e);
      }

      this.$store.dispatch("setTxHash", txHash);
      this.postCall(txHash);
    },
    async approveZero() {
      let txHash;

      try {
        txHash = await sendApprove(this.activeContract, 0);
      } catch (e) {
        console.log(e);
      }

      this.$store.dispatch("setTxHash", txHash);
      this.postCall(txHash);
    },
    async callTransferFrom() {
      // check client doesn'ganz already have an escrow
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

      const arg = {
        tokenAmount: this.tokenAmount,
        clientName: this.clientName,
        termLength: this.termLength,
        recurring: true,
      };

      let txHash;

      try {
        txHash = await methodSender("transferFrom", arg, this.activeContract);
      } catch (e) {
        console.log(e);
        this.$store.dispatch("setError", e.code);
      }

      this.postCall(txHash);
    },
    async callCancel() {
      let txHash;

      try {
        txHash = await methodSender(
          "cancel",
          this.activeAccount,
          this.activeContract
        );
      } catch (e) {
        this.$store.dispatch("setError", e.code);
      }

      this.postCall(txHash);
    },
  },
  created() {
    const contractURL = this.$route.query.contract;
    console.log(contractURL);

    if (contractURL) {
      this.$store.dispatch("manualSetContract", contractURL);
    }

    this.callGetEscrowValues();
    this.getAllowance();

    window.ethereum.on("accountsChanged", function(accounts) {
      this.getAllowance();
    });
  },
  watch: {
    activeAccount: function() {
      this.callGetEscrowValues();
    },
  },
};
</script>
