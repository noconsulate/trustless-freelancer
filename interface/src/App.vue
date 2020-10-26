<template>
  <div class="border container mx-auto px-4">
    <p class="border text-3xl">trustless-freelancer</p>
    <div class="flex space-x-4">
      <router-link to="/">
        <p :class="rootButtonClass">Merchant view</p>
      </router-link>
      <router-link :class="logsButtonClass" to="/logs">
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
    rootButtonClass: function() {
      return {
      'bg-blue-200': this.$route.name == 'root',
      'bg-gray-300': this.$route.name != 'root'
      }
    },
    logsButtonClass: function() {
      return {
      'bg-blue-200': this.$route.name == 'logs',
      'bg-gray-300': this.$route.name != 'logs'
      }
    }
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
