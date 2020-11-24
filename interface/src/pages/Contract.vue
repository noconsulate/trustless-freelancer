<template>
  <div class="flex justify-center">
    <div class="w-2/3 bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Freelancer contract at
        </h3>
        <p class="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
          {{ activeContract }}
        </p>
      </div>
      <dl>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm leading-5 font-medium text-gray-500">
            Get contract
          </dt>
          <dd
            class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
          >
            <button @click="callGetContract" class="btn ">
              get contract
            </button>
          </dd>
        </div>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm leading-5 font-medium text-gray-500">
            Deploy contract
          </dt>
          <dd
            class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
          >
            <input
              class="border border-black"
              v-model="contractNameInput"
              placeholder="please name your contract"
            />

            <button @click="callGetContract" class="btn ">
              deploy
            </button>
          </dd>
        </div>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm leading-5 font-medium text-gray-500">
            Set contract manually
          </dt>
          <dd
            class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
          >
            <input class="border border-black" v-model="contractInput" />
            <button class="btn" @click="manualSetContract">set</button>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import { deploy, getContract } from "../services/web3";

export default {
  data() {
    return {
      freelancerAddress: null,
      contractInput: "0x23096c54bC7672F5e41a79Fa3E8f8F9A34daC4dE",
      contractNameInput: "",
    };
  },
  computed: {
    activeContract() {
      return this.$store.state.activeContract;
    },
  },
  methods: {
    // should fetchActiveContract after confirmation
    async callSendDeploy() {
      // this line is sluggy
      const contract = await getContract();
      if (contract != 0) {
        alert(
          `the account you're sending from already has a freelancer contract!`
        );
        return;
      }
      // needs validation to disallow empty name
      deploy(contractNameInput);
    },
    // is this function/button necessary?
    async callGetContract() {
      await this.$store.dispatch("fetchActiveContract");

      if (this.activeContract != null && this.activeContract != 0) {
        this.$store.dispatch("fetchClients", this.$store.state.activeContract);
        this.$store.dispatch("fetchValues", this.$store.state.activeContract);
      }
    },
    async manualSetContract() {
      await this.$store.dispatch("manualSetContract", this.contractInput);

      if (this.activeContract != null && this.activeContract != 0) {
        this.$store.dispatch("fetchClients", this.$store.state.activeContract);
        this.$store.dispatch("fetchValues", this.$store.state.activeContract);
      }
    },
  },
  created: async function() {
    // this.$store.dispatch("fetchActiveContract");
  },
};
</script>
