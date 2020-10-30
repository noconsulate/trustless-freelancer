<template>
  <div class="border border-red-700">
    <div class="description">error:</div>
    <div class="content">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  computed: {
    errorMessage() {
      return this.$store.state.errorMessage;
    },
  },
};
</script>

<style scoped>
p {
  color: red;
}
</style>
