<template>
  <div class="row" id="appc">
    <button @click="enableEthereum">enable ethereum!</button>
    <button @click="callReset">reset</button>
    <button @click="callMarkShipped">mark shipped</button>
  </div>
</template>

<script>
import { reset, getAccount, markShipped } from '../services/web3';

export default {
  methods:{
    async enableEthereum() {
     const account = await getAccount();
     this.$store.dispatch('setAccount', account);
    },
    async callReset() {
      const res = await reset();
      this.$store.dispatch('fetchValues', null);
    },
    callMarkShipped() {
      markShipped()
        .catch(e => this.$store.dispatch('setError', e.code))
        .then(res => console.log(res))
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