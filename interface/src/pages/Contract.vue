<template>
  <div class="flex flex-col space-y-2">
    <div class="space-x-1">
      <button @click="callGetContract" class="btn ">
        get contract
      </button>
      <button @click="callSendDeploy" class="btn ">
        deploy
      </button>
    </div>
    <div class="description">
      set contract manually
    </div>
    <div class="space-x-1">
      <input class="border border-black" v-model="contractInput" />
      <button class="btn" @click="manualSetContract">set</button>
    </div>
    <div>
      <div class="description">
        freelancer contract at
      </div>
      <div class="content">
        {{ activeContract }}
      </div>
    </div>

    <div v-if="activeContract == 0">why don't you make a contract</div>
  </div>
</template>

<script>
import { deploy, getContract } from "../services/web3";

export default {
  data() {
    return {
      freelancerAddress: null,
      contractInput: "0x23096c54bC7672F5e41a79Fa3E8f8F9A34daC4dE",
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
      deploy();
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
