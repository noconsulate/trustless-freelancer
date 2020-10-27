<template>
  <div>
    <div>error:</div>
    <div> {{ errorMessage }} </div>
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