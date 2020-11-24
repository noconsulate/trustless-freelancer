<template>
  <div>
    <div class="container">
      <button @click="display = !display">Switch</button>
      <transition name="block">
        <div class="item" v-if="display">1</div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
body {
  align-content: center;
}
.container {
  display: grid;
  grid-gap: 20px;
  width: 500px;
  margin: 0 auto;
}
.item {
  background-color: blue;
  height: 100px;
}
.block-enter {
  opacity: 0;
}
.block-enter-active {
  transition: opacity 2s;
}
.block-leave {
}
.block-leave-active {
  transition: opacity 2s;
  opacity: 0;
}
</style>

<script>
export default {
  data() {
    return {
      display: false,
    };
  },
};
</script>
