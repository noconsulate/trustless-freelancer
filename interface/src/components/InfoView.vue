<template>
  <div>
    <h2>contract address</h2>
    {{ contractValues.address }}
    <h2>admin address</h2>
    {{contractValues.admin}}
  </div>
</template>

<script>
export default {
  computed: {
    stringFromStore() {
      return this.$store.state.aString;
    },
    contractValues() {
      return this.$store.state.contractValues;
    }
  }
}
</script>