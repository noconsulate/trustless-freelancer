<template>
  <div class="flex justify-center">
    <div class="w-2/3 bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Merchant dashboard
        </h3>
        <p class="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
          Manage your trustless-freelancer smart contract.
        </p>
      </div>
      <div>
        <dl>
          <div
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Contract name
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {{ contractValues.name }}
            </dd>
          </div>
          <div
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Contract address
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {{ activeContract }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Contract balance
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {{ contractValues.balance }} tokens
            </dd>
          </div>
          <div
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Owner address
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {{ contractValues.owner }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Clients
            </dt>
            <dd class="mt-1  leading-5  sm:mt-0 sm:col-span-2">
              <select-client :clients="this.clientDetails" />
            </dd>
          </div>
          <div
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Client address
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {{ selectedClientDetails.address }}
            </dd>
          </div>
          <div
            class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Escrow balance
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {{ selectedClientDetails.balance }}
            </dd>
          </div>
          <div
            class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
          >
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Shipped?
            </dt>
            <dd
              class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2 \"
            >
              <checkbox
                :isTrue="selectedClientDetails.isShipped"
                :sendTx="callMarkShipped"
              />
            </dd>
          </div>

          <div v-if="difference < 0">
            <button class="btn" @click="callDisperse">
              disperse
            </button>
          </div>
          <div>now {{ nowTime }}</div>
          <div>start time {{ startTime }}</div>
          <div>end time {{ endTime }}</div>
          <div>difference {{ difference }} days</div>
          <div class="bg-white px-4 py-3 ">
            <controls class="w-1/2 " />
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import { getAccount, awaitTxMined, methodSender } from "../services/web3.js";
import InfoView from "../components/InfoView";
import Controls from "../components/Controls";
import Select from "../components/elements/Select";
import Checkbox from "../components/elements/Checkbox";

export default {
  name: "MerchantView",
  components: {
    "info-view": InfoView,
    controls: Controls,
    "select-client": Select,
    checkbox: Checkbox,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    activeContract() {
      return this.$store.state.activeContract;
    },
    contractValues() {
      return this.$store.state.contractValues;
    },
    clients() {
      return this.$store.state.clients;
    },
    clientDetails() {
      return this.$store.state.clientDetails;
    },
    selectedClient() {
      return this.$store.state.selectedClient;
    },
    selectedClientDetails() {
      let details = {
        name: null,
        balance: null,
        address: null,
        isShipped: null,
      };
      6;
      if (!this.selectedClient) {
        return details;
      }
      this.clientDetails.map((client) => {
        this.selectedClient == client.name ? (details = client) : null;
      });

      return details;
    },
    startTime() {
      const startMillis =
        Number(this.selectedClientDetails.endTime) -
        this.selectedClientDetails.term;

      const dt = DateTime.fromMillis(startMillis);

      return dt.toLocaleString();
    },
    endTime() {
      const dt = DateTime.fromMillis(
        Number(this.selectedClientDetails.endTime)
      );

      return dt.toLocaleString();
    },
    nowTime() {
      const dt = DateTime.local();

      return dt.toLocaleString();
    },
    difference() {
      const end = DateTime.fromMillis(
        Number(this.selectedClientDetails.endTime)
      );
      const diff = end.diffNow("days");

      return diff.toObject().days;
    },
  },
  data() {
    return {};
  },
  methods: {
    async postCall(txHash) {
      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      console.log("confirmed");
      this.$store.dispatch("fetchValues");
      this.$store.dispatch("fetchClients");
    },
    async callMarkShipped() {
      if (
        window.ethereum.selectedAddress.toUpperCase() !=
        this.$store.state.contractValues.owner.toUpperCase()
      ) {
        alert("only the merchant can mark shipped");
        return;
      }

      let txHash;

      try {
        txHash = await methodSender(
          "markShipped",
          this.selectedClientDetails.address,
          this.activeContract
        );
      } catch (e) {
        this.$store.dispatch("setError", e.code);
      }

      this.postCall(txHash);
    },
    async callDisperse() {
      let txHash;

      try {
        txHash = await methodSender(
          "disperse",
          this.selectedClientDetails.address,
          this.activeContract
        );
      } catch (e) {
        this.$store.dispatch("setError", e.code);
      }

      this.postCall(txHash);
    },
  },
  created: async function() {
    const contractURL = this.$route.query.contract;
    console.log(contractURL);

    if (contractURL) {
      this.$store.dispatch("manualSetContract", contractURL);
    }

    if (this.activeContract == 0 || this.activeContract == null) {
      alert("please deploy a new contract or load an existing one");
      return;
    }

    this.$store.dispatch("fetchClients", this.$store.state.activeContract);
    this.$store.dispatch("fetchValues", this.$store.state.activeContract);
  },
};
</script>
