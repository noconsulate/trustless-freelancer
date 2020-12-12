<template>
  <div class="container md mx-auto">
    <div class=" border border-1 h-screen flex flex-col space-y-2">
      <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-2">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <span class="font-semibold text-xl tracking-tight"
            >Trustless-Freelancer</span
          >
        </div>

        <div
          class="w-full block flex-grow lg:flex lg:items-center lg:w-auto z-40"
        >
          <div class="text-sm lg:flex-grow">
            <router-link
              :disabled="noContract"
              to="/merchant"
              :class="navButton"
            >
              Merchant
            </router-link>
            <router-link to="/client" :class="navButton">
              Client
            </router-link>
            <router-link :disabled="noContract" to="/logs" :class="navButton">
              Logs
            </router-link>
            <router-link
              :disabled="noContract"
              to="/contract"
              :class="navButton"
            >
              Contract
            </router-link>
            <router-link to="/create_invoice" :class="navButton">
              Create Invoice
            </router-link>
          </div>
          <div>
            <a
              href="#"
              class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
              >thisdoesnothing!</a
            >
          </div>
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
  },
  data() {
    return {
      routeName: this.$route.name,
      navButton:
        "block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4",
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
      console.log("no metamask");
    } else {
      this.$store.dispatch("setIsMetamask", false);
      alert("please install metamask");
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
    // if (window.ethereum.chainId !== "0x539") {
    //   alert("please switch Metamask to the correct chain");
    // }

    // window.ethereum.on("chainChanged", (chainId) => {
    //   if (chainId !== "0x539") {
    //     alert("please switch Metamask to the correct chain");
    //   }
    //   window.location.reload();
    // });
  },
};
</script>
