<template>
  <div class="container px-16">
    <div class="text-3xl bg-gradient-to-r to-red-400 from-blue-300">
      trustless-freelancer
    </div>
    <nav class="flex relative space-x-4">
      <router-link to="/">
        <button :class="[rootButtonClass, 'px-4']">Merchant view</button>
      </router-link>
      <router-link to="/logs">
        <button :class="[logsButtonClass, 'px-4']">
          logs
        </button>
      </router-link>
      <router-link to="/contract">
        <button :class="[contractButtonClass, 'px-4']">
          contract
        </button>
      </router-link>

      <div class="absolute inset-y-o right-0">{{ routeName }}</div>
    </nav>

    <router-view></router-view>
    <div class="h-3" />
    <transaction-view />
    <error-view />
  </div>
</template>

<script>
import TransactionView from "./components/TransactionView";
import ErrorView from "./components/ErrorView";

export default {
  name: "App",
  components: {
    "transaction-view": TransactionView,
    "error-view": ErrorView,
  },
  computed: {
    rootButtonClass: function() {
      return {
        "bg-blue-200": this.$route.name == "root",
        "bg-gray-300 hover:bg-gray-500": this.$route.name != "root",
      };
    },
    logsButtonClass: function() {
      return {
        "bg-blue-200": this.$route.name == "logs",
        "bg-gray-300 hover:bg-gray-500": this.$route.name != "logs",
      };
    },
    contractButtonClass: function() {
      return {
        "bg-blue-200": this.$route.name == "contract",
        "bg-gray-300 hover:bg-gray-500": this.$route.name != "contract",
      };
    },
  },
  data() {
    return {
      routeName: this.$route.name,
    };
  },
  watch: {
    $route: "currentRoute",
  },
  methods: {
    currentRoute() {
      this.routeName = this.$route.name;
    },
  },
};
</script>
