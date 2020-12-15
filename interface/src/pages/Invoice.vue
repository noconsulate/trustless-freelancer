<template>
  <div class="flex justify-center">
    <div class="w-2/3 flex-col">
      <div>
        <div>contract</div>
        <div class="font-bold">{{ contractValues.name }}</div>
        <div>at</div>
        <div class="font-bold">{{ activeContract }}</div>
      </div>
      <div class="space-y-1">
        <div>
          <input
            v-model="clientName"
            id="clientName"
            class="border border-black"
          />

          <label for="clientName">name</label>
        </div>
        <div>
          <input v-model="value" id="value" class="border border-black" />
          <label for="value">tokens</label>
        </div>
        <div>
          <input v-model="term" id="term" class="border border-black" />
          <label for="term">term</label>
        </div>
        <div>
          <input type="checkbox" id="recurring" v-model="recurring" />
          <label for="checkbox">recurring?</label>
        </div>
        <div>
          <button class="btn" @click="approveMax">approve max</button>
          <button class="btn" @click="approveOnce">approve once</button>
        </div>
        <div>balance: {{ balance }}</div>
        <div>allowance: {{ allowance }}</div>
        <div>
          <button class="btn" @click="pay">pay</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendApprove, checkBalance, checkAllowance } from "../services/token";
import { awaitTxMined, getEscrowValues, methodSender } from "../services/web3";
export default {
  name: "invoice",
  data() {
    return {
      contract: null,
      clientName: null,
      value: null,
      term: null,
      recurring: null,
      allowance: null,
      balance: null,
    };
  },
  computed: {
    activeContract() {
      return this.$store.state.activeContract;
    },
    contractValues() {
      return this.$store.state.contractValues;
    },
  },
  methods: {
    async approveMax() {
      //  const maxToken = await new BigNumber((2 ** 256 - 1) / 10 ** 18);
      // console.log(maxToken);

      // danger danger this isn't real
      // need to figure out why BN isn't working on server

      let txHash;

      try {
        txHash = await sendApprove(this.activeContract, 1000000);
      } catch (e) {
        console.log(e);
      }

      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      this.getBalanceAndAllowance();
    },
    async approveOnce() {
      let txHash;

      try {
        txHash = await sendApprove(this.activeContract, this.value);
      } catch (e) {
        console.log(e);
      }

      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      this.getBalanceAndAllowance();
    },
    async pay() {
      if (this.balance < this.value) {
        alert("this account doesn't have enough funds");
      }

      const args = {
        tokenAmount: this.value,
        clientName: this.clientName,
        termLength: this.term,
        recurring: this.recurring,
      };

      let txHash;

      try {
        txHash = await methodSender("transferFrom", args, this.activeContract);
      } catch (e) {
        console.log(e);
        this.$store.dispatch("setError", e.code);
      }

      let receipt = await awaitTxMined(txHash);
      alert("congradulations you made it");
    },
    async getBalanceAndAllowance() {
      // get current metamask account's balance and allowance
      let balance, allowance;
      try {
        balance = await checkBalance(window.ethereum.selectedAddress);
      } catch (e) {
        console.log(e);
      }

      this.balance = balance;

      try {
        allowance = await checkAllowance(this.activeContract);
      } catch (e) {
        console.log(e);
      }

      this.allowance = allowance;
    },
  },
  async created() {
    const { contract, client, value, term, recurring } = this.$route.query;

    this.contract = contract;
    this.clientName = client;
    this.value = value;
    this.term = term;
    this.recurring = recurring;

    if (contract) {
      this.$store.dispatch("manualSetContract", contract);
      this.$store.dispatch("fetchValues");
    }

    this.getBalanceAndAllowance();
  },
};
</script>
