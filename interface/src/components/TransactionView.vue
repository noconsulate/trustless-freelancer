<template>
  <div>
    <div class="description">transaction hash</div>

    <div class="content">
      {{ txHash }}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    txHash() {
      return this.$store.state.txHash;
    },
  },
  data() {
    return {};
  },
};
</script>
