import Vue from "vue";
import Vuex from "vuex";
import uniqueId from "lodash.uniqueid";

import {
  getValues,
  getClients,
  getEscrowValues,
  getContract,
} from "../services/web3.js";

const ethereum = window.ethereum;

Vue.use(Vuex);

const ESCROW_VALUES_DEFAULT = {
  address: null,
  balance: null,
  isShipped: null,
  isReceived: null,
};

export default new Vuex.Store({
  state: {
    isMetamask: null,
    account: null,
    contractValues: { owner: null, balance: null },
    errorMessage: "",
    txHash: "",
    clients: [{ id: null, address: null }],
    escrowValues: ESCROW_VALUES_DEFAULT,
    escrowFetched: false,
    activeContract: "0x23096c54bc7672f5e41a79fa3e8f8f9a34dac4de",
  },
  mutations: {
    UPDATE_ISMETAMASK(state, payload) {
      state.isMetamask = payload;
    },
    UPDATE_VALUES(state, payload) {
      state.contractValues = payload;
    },
    UPDATE_CLIENTS(state, payload) {
      let clients = [];
      payload.forEach((address) => {
        const id = uniqueId();
        clients.push({ id, address });
      });

      state.clients = clients;
    },
    UPDATE_ESCROW(state, payload) {
      state.escrowValues = payload;
      state.escrowFetched = true;
    },
    UPDATE_ACCOUNT(state, payload) {
      state.account = payload;
    },
    UPDATE_ERROR(state, payload) {
      state.errorMessage = payload;
    },
    UPDATE_TXHASH(state, payload) {
      state.txHash = payload;
    },
    UPDATE_ACTIVE_CONTRACT(state, payload) {
      state.activeContract = payload;
    },
  },
  actions: {
    setIsMetamask(context, value) {
      context.commit("UPDATE_ISMETAMASK", value);
    },
    async fetchClients(context) {
      const clientsArray = await getClients(context.state.activeContract);
      context.commit("UPDATE_CLIENTS", clientsArray);
    },
    async fetchEscrowValues(context, client) {
      const values = await getEscrowValues(
        client,
        context.state.activeContract
      );
      values.address = client;
      context.commit("UPDATE_ESCROW", values);
    },
    async fetchValues(context) {
      const values = await getValues(context.state.activeContract);
      context.commit("UPDATE_VALUES", values);
    },
    setAccount(context, account) {
      console.log("setAccount action", account);
      context.commit("UPDATE_ACCOUNT", account);

      ethereum.on("accountsChanged", function(accounts) {
        console.log("accounts changed in store.js", accounts);
        context.commit("UPDATE_ACCOUNT", accounts[0]);
      });
    },
    setError(context, message) {
      context.commit("UPDATE_ERROR", message);
    },
    setTxHash(context, hash) {
      context.commit("UPDATE_TXHASH", hash);
    },
    async fetchActiveContract(context) {
      const address = await getContract();
      context.commit("UPDATE_ACTIVE_CONTRACT", address);
    },
    async manualSetContract(context, address) {
      context.commit("UPDATE_ACTIVE_CONTRACT", address);
    },
    resetEscrow(context) {
      context.commit("UPDATE_ESCROW", ESCROW_VALUES_DEFAULT);
    },
  },
  getters: {},
});
