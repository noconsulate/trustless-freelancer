<template>
  <div>
    <h2>error:</h2>
    {{ errorMessage }}
  </div>
</template>

<script>
export default {
  computed: {
    errorMessage() {
      return this.$store.state.errorMessage
    }
  }
}
</script>

<style scoped>
p {
  color: red;
}
</style>