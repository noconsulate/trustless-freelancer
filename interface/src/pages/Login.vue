<template>
  <div>
    <div>current auth() UID {{ userUid }}</div>
    <div>current address {{ currentAccount }}</div>

    <div><button @click="newUser" class="btn">add user</button></div>
  </div>
</template>

<script>
/* http stuff and whatnot to be moved later */
import { auth, signAndVerify } from "../services/firebase";
import Web3 from "web3";
const axios = require("axios").default;

// for local functions emulator
// const URL = "http://localhost:5001/freelancer-40250/us-central1/";

const URL = "https://us-central1-freelancer-40250.cloudfunctions.net/";

export default {
  name: "login",
  data() {
    return {
      userUid: "",
      currentAccount: "",
    };
  },
  computed: {},
  methods: {
    async newUser() {
      axios
        .post(URL + `addUser?user=${this.selectedAddress}`)
        .then((res) => {
          console.log(res);
          this.nonce = res.data.nonce;
        })
        .catch((e) => console.log(e));
    },
  },
  async created() {
    // listen for firebase auth
    auth().onAuthStateChanged(async (user) => {
      console.log("auth() listener");
      let uid = null;
      if (user != null) {
        uid = user.uid;
        this.userUid = uid;
      }
    });
    // wake up metamask
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);
    this.currentAccount = accounts[0];
    const token = await signAndVerify(accounts[0]);
    console.log(token);
    auth().signInWithCustomToken(token);
  },
};
</script>
