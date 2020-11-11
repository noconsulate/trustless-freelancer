<template>
  <div>
    <div class="inline-block relative w-2/3">
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
    <button @click="callGetEscrowValues" class="btn flex-1">
      get escrow
    </button>
  </div>
</template>

<script>
import { getValues } from "../../services/web3";
export default {
  props: ["clients"],
  data() {
    return {
      selectedClient: null,
      activeContract: this.$store.state.activeContract,
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
};
</script>
