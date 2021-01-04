<template>
  <div>
    <div>current address {{ selectedAddress }}</div>
    <div>
      <button @click="getNonce" class="btn">get nonce</button>
      {{ nonce }}
    </div>
    <div><button @click="newUser" class="btn">add user</button></div>
    <div class="break-words">
      <button @click="sign" class="btn">sign</button>signature: {{ signature }}
    </div>
    <div class="break-words">
      <button @click="verify" class="btn">verify</button>token: {{ token }}
    </div>
    <div>
      <button @click="signIn" class="btn">sign in</button>
    </div>
  </div>
</template>

<script>
/* http stuff and whatnot to be moved later */
import { auth } from "../services/firebase";
import Web3 from "web3";
const axios = require("axios").default;

// for local functions emulator
// const URL = "http://localhost:5001/freelancer-40250/us-central1/";

const URL = "https://us-central1-freelancer-40250.cloudfunctions.net/";

export default {
  name: "login",
  data() {
    return {
      nonce: "",
      signature: "",
      token: "",
    };
  },
  computed: {
    selectedAddress() {
      return this.$store.state.account;
    },
  },
  methods: {
    async getNonce() {
      let nonce;
      axios
        .get(URL + `getUser?user=${this.selectedAddress}`)
        .then((res) => {
          console.log(res.data.nonce);
          this.nonce = res.data.nonce;
        })
        .catch((e) => console.log(e));
    },
    async newUser() {
      axios
        .post(URL + `addUser?user=${this.selectedAddress}`)
        .then((res) => {
          console.log(res);
          this.nonce = res.data.nonce;
        })
        .catch((e) => console.log(e));
    },
    async sign() {
      const web3 = new Web3(window.ethereum);

      const message = "words";

      const signature = await web3.eth.personal.sign(
        web3.utils.fromUtf8(`words ${this.nonce}`),
        window.ethereum.selectedAddress
      );

      console.log(signature);
      this.signature = signature;
    },
    async verify() {
      axios
        .post(
          URL +
            `verify?address=${this.selectedAddress}&signature=${this.signature}`
        )
        .then((res) => {
          console.log(res.data);
          this.token = res.data.token;
        });
    },
    signIn() {
      auth()
        .signInWithCustomToken(this.token)
        .then((user) => {
          console.log("signed in");
          window.user = user;
        });
    },
  },
};
</script>
