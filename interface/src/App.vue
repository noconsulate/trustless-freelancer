<template>
  <div class="container md px-16 h-64">
    <div class="text-3xl bg-gradient-to-r to-red-400 from-blue-300">
      trustless-freelancer
    </div>
    <nav class="flex relative space-x-4">
      <router-link to="/merchant">
        <button :disabled="noContract" :class="[rootButtonClass, 'px-4']">
          Merchant view
        </button>
      </router-link>
      <router-link to="/logs">
        <button :disabled="noContract" :class="[logsButtonClass, 'px-4']">
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
    <div class="object-none object-bottom">
      <transaction-view />
      <error-view />
    </div>
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
    noContract() {
      return (
        this.$store.state.activeContract == null ||
        this.$store.state.activeContract == 0
      );
    },
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
  created: function() {},
};
</script>
