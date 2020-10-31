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
import { methodSender, getContract } from "../services/web3";

export default {
  data() {
    return {
      freelancerAddress: null,
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
      const contract = await getContract();
      if (contract != 0) {
        alert(
          `the account you're sending from already has a freelancer contract!`
        );
        return;
      }
      methodSender("deploy");
    },
    async callGetContract() {
      await this.$store.dispatch("fetchActiveContract");

      if (this.activeContract != null || this.activeContract != 0) {
        this.$store.dispatch("fetchClients", this.$store.state.activeContract);
        this.$store.dispatch("fetchValues", this.$store.state.activeContract);
      }
    },
  },
  created: async function() {
    // this.$store.dispatch("fetchActiveContract");
    // window.ethereum.on("accountsChanged", (accounts) => {
    //   this.$store.dispatch("fetchActiveContract");
    // });
  },
};
</script>
