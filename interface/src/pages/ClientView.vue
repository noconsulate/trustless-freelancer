<template>
  <div class="flex justify-center">
    <div class="">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Contract Information
          </h3>
          <p class="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
            {{ contractDescription1 }}
          </p>
          <p class="mt-2 max-w-2xl text-sm leading-5 text-gray-500">
            {{ contractDescription2 }}
          </p>
        </div>
        <div>
          <dl>
            <div
              class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm leading-5 font-medium text-gray-500">
                Contract address
              </dt>
              <dd
                class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2 "
              >
                <div class="w-full space-x-1 flex">
                  <input
                    v-model="addressInput"
                    placeholder="enter address"
                    class="block appearance-none w-3/4 bg-white border border-gray-400 hover:border-gray-500 px-4 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                  <button class="btn w-1/4" @click="manualSetContract">
                    set
                  </button>
                </div>
              </dd>
            </div>
            <div
              class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm leading-5 font-medium text-gray-500">
                Your escrow
              </dt>
              <dd
                class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
              >
                <div class="flex w-full space-x-1">
                  <p class="w-3/4">
                    {{ clientBalance }}
                  </p>
                  <button class="btn w-1/4" @click="callGetEscrowValues">
                    get
                  </button>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addressInput: null,
    };
  },
  computed: {
    activeContract() {
      return this.$store.state.activeContract;
    },
    clients() {
      return this.$store.state.clients;
    },
    hasEscrow() {
      let exists = false;
      if (!this.clients) {
        return exists;
      }
      this.clients.map((item) => {
        item.address.toUpperCase() ==
        window.ethereum.selectedAddress.toUpperCase()
          ? (exists = true)
          : null;
      });
      return exists;
    },
    clientBalance() {
      return this.$store.state.escrowValues.balance;
    },
    contractDescription1() {
      return this.activeContract
        ? `Client interaction for contract at:`
        : "Enter a merchant's contract address";
    },
    contractDescription2() {
      return this.activeContract ? `${this.activeContract}` : null;
    },
  },
  methods: {
    async manualSetContract() {
      await this.$store.dispatch("manualSetContract", this.addressInput);

      if (this.activeContract != null && this.activeContract != 0) {
        this.$store.dispatch("fetchClients", this.$store.state.activeContract);
        this.$store.dispatch("fetchValues", this.$store.state.activeContract);
      }
    },
    callGetEscrowValues() {
      this.$store.dispatch(
        "fetchEscrowValues",
        window.ethereum.selectedAddress
      );
    },
  },
};
</script>
