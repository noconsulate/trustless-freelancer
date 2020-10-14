<template>
  <div>
    <h2>transaction hash</h2>
    {{ txHash }}
  </div>
</template>

<script>
export default {
  computed: {
    txHash() {
      return this.$store.state.txHash;
    }
  }
}
</script>