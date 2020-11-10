<template>
  <div class="container md mx-auto">
    <div class=" border border-1 h-screen flex p-4 flex-col space-y-2">
      <div class="text-3xl bg-gradient-to-r to-red-400 from-blue-300">
        trustless-freelancer
      </div>
      <nav class="flex relative space-x-4 border border-black">
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

        <div class="absolute inset-y-o right-0 pr-2 italic">
          {{ routeName }}
        </div>
      </nav>
      <div class="flex-grow overflow-y-auto">
        <router-view></router-view>
      </div>

      <div class="object-none object-bottom">
        <transaction-view />
        <error-view />
      </div>
    </div>
  </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";

import TransactionView from "./components/TransactionView";
import ErrorView from "./components/ErrorView";

export default {
  name: "App",
  components: {
    "transaction-view": TransactionView,
    "error-view": ErrorView,
  },
  computed: {
    // disable nav buttons if no contract loaded
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
  created: async function() {
    // check browser for metamask
    const provider = await detectEthereumProvider({
      mustBeMetaMask: true,
    });

    if (provider) {
      console.log("Ethereum detected", provider);
      this.$store.dispatch("setIsMetamask", true);
    } else {
      this.$store.dispatch("setIsMetamask", false);
      // alert("please install metamask");
    }

    // enable metamask in browser(require user login to metamask)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      this.$store.dispatch("setAccount", accounts[0]);
    } catch (e) {
      console.log("problem enabling ethereum");
    }

    // make sure we're on the right chain
    if (window.ethereum.chainId !== "0x539") {
      alert("please switch Metamask to the correct chain");
    }

    window.ethereum.on("chainChanged", (chainId) => {
      if (chainId !== "0x539") {
        alert("please switch Metamask to the correct chain");
      }
      window.location.reload();
    });
  },
};
</script>
