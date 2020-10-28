import Vue from 'vue';
import Vuex from 'vuex';
import uniqueId from 'lodash.uniqueid';

import {getValues, getClients, getEscrowValues, getContract} from '../services/web3.js';

const ethereum = window.ethereum;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account : null,
    contractValues: { address: null, owner: null, balance: null},
    errorMessage: '',
    txHash: '',
    clients: [{ id: null, address: null }],
    escrowValues: { address: null, balance: null, isShipped: null, isReceived: null, },
    escrowFetched: false,
    activeContract: "0xB09f06F5C3e76e9eda0dBA8b98E0f7ACC2a223aa",
  },
  mutations: {
    UPDATE_VALUES(state, payload) {
      state.contractValues = payload;
    },
    UPDATE_CLIENTS(state, payload) {
      let clients = [];
      payload.forEach(address => {
        const id = uniqueId();
        clients.push({ id, address});
      })

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
    }
  },
  actions: {
    async fetchClients(context) {
      const clientsArray = await getClients(context.state.activeContract);
      context.commit("UPDATE_CLIENTS", clientsArray);
    },
    async fetchEscrowValues(context, client) {
      const values = await getEscrowValues(client, context.state.activeContract);
      values.address = client;
      context.commit('UPDATE_ESCROW', values)
    },
    async fetchValues(context, address) {
      const values = await getValues(address);
      context.commit("UPDATE_VALUES", values)

      // WHY THIS?

      // ethereum.on('accountsChanged', function(accounts) {
      //   console.log('accounts changed in store.js', accounts);
      //   context.commit("UPDATE_ACCOUNT", accounts[0]);
      // })
    },
    setAccount(context, account) {
      context.commit("UPDATE_ACCOUNT", account);
    },
    setError(context, message) {
      context.commit("UPDATE_ERROR", message);
    },
    setTxHash(context, hash) {
      context.commit("UPDATE_TXHASH", hash);
    },
    async fetchActiveContract(context) {
      const address = await getContract();
      console.log('fetch')
      context.commit("UPDATE_ACTIVE_CONTRACT", address)
    }
  },
  getters: {
  },
});