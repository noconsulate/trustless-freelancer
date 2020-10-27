<template>
  <div>
    <div :class="descriptionClass">transaction hash</div>
    <div :class="contentClass">
      {{ txHash }}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    txHash() {
      return this.$store.state.txHash;
    }
  },
  data () {
    return {
      descriptionClass: "text-lg font-bold bg-gradient-to-r from-gray-400",
      contentClass: "text-red-600 text-sm h-4"
    }
  },
}
</script>