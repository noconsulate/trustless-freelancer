<template>
  <div class="flex justify-center max-w-full">
    <div class="shadow-xl p-3">
      <info-view />
      <controls />
    </div>
  </div>
</template>

<script>
import { doThing, getAccount, getValues } from "../services/web3.js";
import InfoView from "../components/InfoView";
import Controls from "../components/Controls";

export default {
  name: "MerchantView",
  components: {
    "info-view": InfoView,
    controls: Controls,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    activeContract() {
      return this.$store.state.activeContract;
    },
  },
  data() {
    return {};
  },
  methods: {},
  created: async function() {
    if (this.activeContract == 0 || this.activeContract == null) {
      alert("please deploy a new contract or load an existing one");
      return;
    }

    this.$store.dispatch("fetchClients", this.$store.state.activeContract);
    this.$store.dispatch("fetchValues", this.$store.state.activeContract);
  },
};
</script>
