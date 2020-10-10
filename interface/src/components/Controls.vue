<template>
  <div>
    <button @click="callReset">reset</button>
  </div>
</template>

<script>
import {reset} from '../services/web3';

export default {
  methods:{
    async callReset() {
      reset()
    }
  }
}
</script>