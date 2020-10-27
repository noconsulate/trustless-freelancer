<template>
  <div>
    <div>
      <button @click="callSendDeploy">
        deploy
      </button>
    </div>
    <div>
      {{ freelancerAddress }}
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
    },
  },
  created: async function() {
    this.callGetContract();
    window.ethereum.on('accountsChanged', (accounts) => {
      this.callGetContract();
    })
  },
};
</script>
