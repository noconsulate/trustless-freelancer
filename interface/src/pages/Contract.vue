<template>
  <div class="flex justify-center">
    <div class="w-2/3 bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Freelancer contract at
        </h3>
        <p class="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
          {{ activeContract }}
          <template v-if="activeContract == 0"
            ><br />
            There is no trustless-freelancer contract for this address.
          </template>
        </p>
      </div>
      <dl>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm leading-5 font-medium text-gray-500">
            <div class="flex flex-wrap">
              <div class="w-full ">
                <div
                  ref="btnRef"
                  v-on:mouseenter="toggleTooltip()"
                  v-on:mouseleave="toggleTooltip()"
                >
                  Load contract
                </div>
                <div
                  ref="tooltipRef"
                  v-bind:class="{ hidden: !tooltipShow, block: tooltipShow }"
                  class="bg-gray-50 border-0 ml-3 block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg"
                >
                  <div>
                    <div
                      class="bg-black text-white opacity-75 font-semibold p-3 mb-0 border-b border-solid border-gray-200 uppercase rounded-t-lg"
                    >
                      Tip
                    </div>
                    <div class="text-black p-3">
                      Load a trustless-freelancer contract associated with your
                      currently selected Metamask account.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dt>
          <dd
            class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
          >
            <button @click="callGetContract" class="btn ">
              Load
            </button>
          </dd>
        </div>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm leading-5 font-medium text-gray-500">
            Create new contract*
          </dt>
          <dd
            class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
          >
            <input
              class="border border-black"
              v-model="contractNameInput"
              placeholder="please name your contract"
            />

            <button @click="callSendDeploy" class="btn ">
              Create
            </button>
          </dd>
        </div>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm leading-5 font-medium text-gray-500">
            Set contract manually***
          </dt>
          <dd
            class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
          >
            <input class="border border-black" v-model="contractInput" />
            <button class="btn" @click="manualSetContract">set</button>
          </dd>
        </div>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dd
            class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-3"
          >
            * Load a trustless-freelancer contract associated with your
            currently selected Metamask account. <br />
            ** Create a new contract associated to your currently selected
            Metamask account. <br />
            *** Load a trustless-freelancer contract with the contract address.
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import { awaitTxMined, deploy, getContract } from "../services/web3";
import Popper from "popper.js";

export default {
  data() {
    return {
      freelancerAddress: null,
      // "0x23096c54bC7672F5e41a79Fa3E8f8F9A34daC4dE"
      contractInput: null,
      contractNameInput: "",
      tooltipShow: false,
    };
  },
  computed: {
    activeContract() {
      return this.$store.state.activeContract;
    },
  },
  methods: {
    toggleTooltip: function() {
      if (this.tooltipShow) {
        this.tooltipShow = false;
      } else {
        this.tooltipShow = true;
        new Popper(this.$refs.btnRef, this.$refs.tooltipRef, {
          placement: "bottom",
        });
      }
    },
    // should fetchActiveContract after confirmation
    async callSendDeploy() {
      // this line is sluggy
      const contract = await getContract();
      if (contract != 0) {
        alert(
          `the account you're sending from already has a freelancer contract!`
        );
        return;
      }
      // needs validation to disallow empty name
      let txHash;
      try {
        txHash = await deploy(this.contractNameInput);
      } catch (e) {
        console.log(e);
      }
      this.$store.dispatch("setTxHash", txHash);

      let receipt = await awaitTxMined(txHash);
      console.log("confirmed");

      this.callGetContract();
    },
    // is this function/button necessary?
    async callGetContract() {
      await this.$store.dispatch("fetchActiveContract");

      if (this.activeContract != null && this.activeContract != 0) {
        this.$store.dispatch("fetchClients", this.$store.state.activeContract);
        this.$store.dispatch("fetchValues", this.$store.state.activeContract);
      }
    },
    async manualSetContract() {
      await this.$store.dispatch("manualSetContract", this.contractInput);

      if (this.activeContract != null && this.activeContract != 0) {
        this.$store.dispatch("fetchClients", this.$store.state.activeContract);
        this.$store.dispatch("fetchValues", this.$store.state.activeContract);
      }
    },
  },
  created: async function() {
    // this.$store.dispatch("fetchActiveContract");
  },
};
</script>
