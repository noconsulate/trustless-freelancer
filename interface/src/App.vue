<template>
  <div class="container md mx-auto">
    <div class=" border border-1 h-screen flex flex-col space-y-2">
      <div class="text-sm flex flex-row">
        <router-link to="/merchant" :class="navButton">
          Merchant
        </router-link>
        <router-link to="/client" :class="navButton">
          Client
        </router-link>
        <router-link to="/logs" :class="navButton">
          Logs
        </router-link>
        <router-link to="/contract" :class="navButton">
          Contract
        </router-link>
        <router-link to="/create_invoice" :class="navButton">
          Create Invoice
        </router-link>
        <router-link to="/login" :class="navButton">
          Sign in
        </router-link>
      </div>

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

// do this elsewhere, please
import firebase from "firebase/app";
import { database } from "./services/firebase";
import Web3 from "web3";

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
      navButton: "text-black px-1",
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

    // this is all for working out firebase auth, put somewhere else later. obvsously!

    window.firebase = firebase;

    let snapshot;
    snapshot = await database()
      .ref("/login_nonces/" + window.ethereum.selectedAddress)
      .once("value");

    const nonce = snapshot.val();
    console.log(nonce);

    const web3 = await new Web3(window.ethereum);

    window.web3 = web3;

    // const signature = await web3.eth.personal.sign(
    //   web3.utils.fromUtf8(`i am signing to login using my nonnce: ${nonce}`),
    //   window.ethereum.selectedAddress
    // );

    // console.log(signature);
  },
};
</script>
