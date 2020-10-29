<template>
  <div>
    <div>
      <button @click="callGetContract" class="btn block">
        get contract
      </button>
      <button @click="callSendDeploy" class="btn block">
        deploy
      </button>
    </div>
    <div class="description">
      freelancer contract at
    </div>
    <div class="content">
      {{ this.$store.state.activeContract }}
    </div>
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
  methods: {
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
      const res = await getContract();
      console.log(res);
      this.freelancerAddress = res;
      this.$store.state.activeContract = res;
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
