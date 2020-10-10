<template>
  <div>
    <h2>contract address</h2>
    {{ contractValues.address }}
    <h2>admin address</h2>
    {{ contractValues.admin }}
    <h2>merchant address</h2>
    {{ contractValues.merchant }}
    <h2>client address</h2>
    {{ contractValues.client }}
    <h2>shipped?</h2>
    {{ contractValues.isShipped }}
    <h2>received?</h2>
    {{ contractValues.isReceived }}
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