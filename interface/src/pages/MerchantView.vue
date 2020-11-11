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
                Clients
              </dt>
              <dd
                class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
              >
                <div class="inline-block relative w-2/3">
                  <select
                    class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                    v-model="selectedClient"
                  >
                    <option class="text-sm" disabled value=""
                      >select a client</option
                    >
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
                <button @click="callGetEscrowValues" class="btn flex-1">
                  get escrow
                </button>
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
      <select-client :clients="this.clients" />
    </div>
  </div>
</template>

<script>
import { doThing, getAccount, getValues } from "../services/web3.js";
import InfoView from "../components/InfoView";
import Controls from "../components/Controls";
import Select from "../components/ elements/Select";

export default {
  name: "MerchantView",
  components: {
    "info-view": InfoView,
    controls: Controls,
    "select-client": Select,
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
    clients() {
      return this.$store.state.clients;
    },
  },
  data() {
    return {
      selectedClient: null,
    };
  },
  methods: {
    async callGetEscrowValues() {
      console.log("getvalues");
      const argsObj = {
        client: this.selectedClient,
        contract: this.activeContract,
      };
      this.$store.dispatch("fetchEscrowValues", this.selectedClient);
    },
  },
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
