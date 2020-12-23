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
    <div><button @click="verify" class="btn">verify</button></div>
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
      nonce: " 7f38a8b9-8916-4161-95ff-6f8e9c33b28c ",
      signature:
        "0x5091378585e6449f68405fc3bf8d06c5513e43567e1c49dd2052467bf671756b57d92ea38339db690596c9913aba62ae7fc6bf55808572f520ee18d2ea4722871b",
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
        .then((res) => console.log(res.data));
    },
  },
};
</script>
