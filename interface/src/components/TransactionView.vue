<template>
  <div>
    <div :class="descriptionClass">transaction hash</div>
  
      <div :class="contentClass">
        {{ txHash }}
      </div>
  </div>
</template>

<script>
import { descriptionClass, contentClass } from "../assets/classMacros";

export default {
  computed: {
    txHash() {
      return this.$store.state.txHash;
    },
  },
  data() {
    return {
      descriptionClass,
      contentClass,
    };
  },
};
</script>
