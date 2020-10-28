<template>
  <div>
    <div>
      <button @click="callSendDeploy">
        deploy
      </button>
    </div>
    <div>
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
    this.$store.dispatch('fetchActiveContract');
    window.ethereum.on('accountsChanged', (accounts) => {
      this.$store.dispatch('fetchActiveContract');
    })
  },
};
</script>
