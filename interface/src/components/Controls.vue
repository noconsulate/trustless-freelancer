<template>
  <div class="row" id="appc">
    <button @click="enableEthereum">enable ethereum!</button>
    <button @click="callReset">reset</button>
    <button>nothing</button>
  </div>
</template>

<script>
import { reset, getAccount } from '../services/web3';

export default {
  methods:{
    async enableEthereum() {
     const account = await getAccount();
     this.$store.dispatch('setAccount', account);
    },
    async callReset() {
      const res = await reset();
      console.log(res);
    },
    async callMarkShipped() {
      markShipped();
    }
  }
}
</script>

<style scoped>
#row {
  display: grid;
  gap: 1rem;
  grid-auto-flow: comlumn;
}

#appc {
  color: rebeccapurple;
}


</style>