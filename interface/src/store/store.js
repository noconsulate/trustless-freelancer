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

export default new Vuex.Store({
  state: {
    isMetamask: null,
    account: null,
    contractValues: { name: null, owner: null, balance: null },
    errorMessage: "",
    txHash: "",
    clients: [],
    clientDetails: [
      {
        id: null,
        name: null,
        address: null,
        balance: null,
        isShipped: null,
      },
    ],
    escrowFetched: false,
    //"0x6FC29547B6ae5A536fF01e46a313cA50D5FC0832"
    activeContract: null,
    selectedClient: null,
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
    UPDATE_CLIENT_DETAILS(state, payload) {
      state.clientDetails = payload;
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
    UPDATE_SELECTED_CLIENT(state, payload) {
      state.selectedClient = payload;
    },
  },
  actions: {
    setIsMetamask(context, value) {
      context.commit("UPDATE_ISMETAMASK", value);
    },
    async fetchClients(context) {
      const clientsArray = await getClients(context.state.activeContract);
      context.commit("UPDATE_CLIENTS", clientsArray);

      let clientDetails = [];

      clientsArray.map(async function(client) {
        const values = await getEscrowValues(
          client,
          context.state.activeContract
        );
        values.address = client;

        values.startTime = new Date(Number(values.startTime));
        values.endTime = new Date(Number(values.endTime));

        clientDetails.push(values);
      });

      context.commit("UPDATE_CLIENT_DETAILS", clientDetails);
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
    setSelectedClient(context, client) {
      context.commit("UPDATE_SELECTED_CLIENT", client);
    },
  },
  getters: {},
});
