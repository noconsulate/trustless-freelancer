<template>
  <div class="border container mx-auto px-4">
    <p class="border text-3xl">trustless-freelancer</p>
    <div class="flex space-x-4">
      <router-link to="/">
        <p class="bg-gray-400">Merchant view</p>
      </router-link>
      <router-link class="bg-gray-300" to="/logs">
        logs
      </router-link>
      <p>{{ routeName }}</p>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
  
  },
  data() {
    return {
      routeName: this.$route.name,
    }
  },
  watch: {
    '$route': 'currentRoute'
  },
  methods: {
    currentRoute() {
      this.routeName = this.$route.name;
    }
  }
};
</script>
