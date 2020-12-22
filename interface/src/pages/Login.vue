<template>
  <div>
    <div>current address {{ selectedAddress }}</div>
    <div>
      <button @click="getNonce" class="btn">get nonce</button>
      {{ nonce }}
    </div>
    <div><button @click="newUser" class="btn">add user</button></div>
    <div class="break-words">
      <button @click="sign" class="btn">sign</button>{{ signature }}
    </div>
  </div>
</template>

<script>
/* http stuff and whatnot to be moved later */
import Web3 from "web3";
const axios = require("axios").default;
const URL = "http://localhost:5001/trustless-freelancer/us-central1/";

export default {
  name: "login",
  data() {
    return {
      nonce: "",
      signature: "",
    };
  },
  computed: {
    selectedAddress() {
      return window.ethereum.selectedAddress;
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

      const signature = await web3.eth.personal.sign(
        web3.utils.fromUtf8(
          `i am signing to login using my nonnce: ${this.nonce}`
        ),
        window.ethereum.selectedAddress
      );

      console.log(signature);
      this.signature = signature;
    },
  },
};
</script>
