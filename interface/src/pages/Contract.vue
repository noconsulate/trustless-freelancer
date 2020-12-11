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
                  ref="refA"
                  v-on:mouseenter="toggleTooltip(0)"
                  v-on:mouseleave="toggleTooltip(0)"
                >
                  Load contract
                </div>
                <div
                  ref="popA"
                  v-bind:class="{
                    hidden: !tooltipShow[0],
                    block: tooltipShow[0],
                  }"
                  class="tooltip"
                >
                  <div>
                    <div class="tooltipHeader">
                      Tip
                    </div>
                    <div class="tooltipBody">
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
            <div class="flex flex-wrap">
              <div class="w-full ">
                <div
                  ref="refB"
                  v-on:mouseenter="toggleTooltip(1)"
                  v-on:mouseleave="toggleTooltip(1)"
                >
                  Create new Contract
                </div>
                <div
                  ref="popB"
                  v-bind:class="{
                    hidden: !tooltipShow[1],
                    block: tooltipShow[1],
                  }"
                  class="tooltip"
                >
                  <div>
                    <div class="tooltipHeader">
                      Tip
                    </div>
                    <div class="tooltipBody">
                      Create a new contract associated to your currently
                      selected Metamask account.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dt>
          <dd
            class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
          >
            contract name
            <div>
              <input
                class="border border-black"
                v-model="contractNameInput"
                placeholder="please name your contract"
              />
            </div>
            service fee
            <div>
              <input
                class="border border-black"
                v-model="serviceFee"
                placeholder="please give % generously"
              />
              <button @click="callSendDeploy" class="btn ">
                Create
              </button>
            </div>
          </dd>
        </div>
        <div
          class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm leading-5 font-medium text-gray-500">
            <div class="flex flex-wrap">
              <div class="w-full ">
                <div
                  ref="refC"
                  v-on:mouseenter="toggleTooltip(2)"
                  v-on:mouseleave="toggleTooltip(2)"
                >
                  Set contract manually
                </div>
                <div
                  ref="popC"
                  v-bind:class="{
                    hidden: !tooltipShow[2],
                    block: tooltipShow[2],
                  }"
                  class="tooltip"
                >
                  <div>
                    <div class="tooltipHeader">
                      Tip
                    </div>
                    <div class="tooltipBody">
                      Load a trustless-freelancer contract with the contract
                      address.
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            The lord is my shepherd I shall not want
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
      serviceFee: 1,
      contractNameInput: "",
      tooltipShow: [false, false],
    };
  },
  computed: {
    activeContract() {
      return this.$store.state.activeContract;
    },
  },
  methods: {
    toggleTooltip: function(elem) {
      let refVar, popperVar;
      switch (elem) {
        case 0:
          refVar = this.$refs.refA;
          popperVar = this.$refs.popA;
          break;
        case 1:
          refVar = this.$refs.refB;
          popperVar = this.$refs.popB;
          break;
        case 2:
          refVar = this.$refs.refC;
          popperVar = this.$refs.popC;
      }
      if (this.tooltipShow[elem]) {
        this.$set(this.tooltipShow, elem, false);
      } else {
        this.$set(this.tooltipShow, elem, true);
        new Popper(refVar, popperVar, {
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
      const parcedFee = this.serviceFee;

      let txHash;
      try {
        txHash = await deploy(this.contractNameInput, parcedFee);
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
