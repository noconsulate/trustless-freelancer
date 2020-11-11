<template>
  <div class="flex justify-center">
    <div class="">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Contract Information
          </h3>
          <p class="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
            Contract details and interaction.
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
                Client Address
              </dt>
              <dd
                class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
              >
                {{ escrowValues.address }}
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
                {{ escrowValues.balance }}
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm leading-5 font-medium text-gray-500">
                Shipped?
              </dt>
              <dd
                class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
              >
                {{ escrowValues.isShipped }}
              </dd>
            </div>
            <div
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm leading-5 font-medium text-gray-500">
                Received?
              </dt>
              <dd
                class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
              >
                {{ escrowValues.isReceived }}
              </dd>
            </div>
            <div class="bg-white px-4 py-3 ">
              <controls class="w-2/3 " />
            </div>
          </dl>
        </div>
      </div>
    </div>
    <!-- <div class="flex flex-col max-w-md">
      <div class="shadow-lg p-3">
        <info-view />
      </div>
      <div class="shadow-lg p-3">
        <controls />
      </div>
    </div> -->
  </div>
</template>

<script>
import { doThing, getAccount, getValues } from "../services/web3.js";
import InfoView from "../components/InfoView";
import Controls from "../components/Controls";

export default {
  name: "MerchantView",
  components: {
    "info-view": InfoView,
    controls: Controls,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    activeContract() {
      return this.$store.state.activeContract;
    },
    escrowValues() {
      return this.$store.state.escrowValues;
    },
    contractValues() {
      return this.$store.state.contractValues;
    },
  },
  data() {
    return {};
  },
  methods: {},
  created: async function() {
    if (this.activeContract == 0 || this.activeContract == null) {
      alert("please deploy a new contract or load an existing one");
      return;
    }

    this.$store.dispatch("fetchClients", this.$store.state.activeContract);
    this.$store.dispatch("fetchValues", this.$store.state.activeContract);
  },
};
</script>
