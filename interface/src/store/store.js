import Vue from 'vue';
import Vuex from 'vuex';
import uniqueId from 'lodash.uniqueid';

import {getValues, getClients, getEscrowValues} from '../services/web3.js';

const ethereum = window.ethereum;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account : '0x935a3de3217d9bb58c24343600f655141d118aeb',
    contractValues: { address: "0xEC73D2658034C6ccA3167ac4e220707dD9076Edc", owner: "0x935A3dE3217D9BB58C24343600f655141d118aeB", balance: 0.2},
    errorMessage: '',
    txHash: '',
    clients: [
      { id: 1, address: "0x3844f4d66EFC4b1441c94DB409dB0521cb718e56" },
      { id: 2, address: "0xe941145418C60A84D98c0e9C181fd19c77f609C2"}
    ],
    escrowValues: { address: "0x3844f4d66EFC4b1441c94DB409dB0521cb718e56", balance: 0.1 , isShipped: false, isReceived: false, },
  },
  mutations: {
    UPDATE_VALUES(state, payload) {
      state.contractValues = payload;
    },
    UPDATE_CLIENTS(state, payload) {
      let clients = [];
      payload.forEach(address => {
        console.log(address);
        const id = uniqueId();
        console.log(id);
        clients.push({ id, address});
      })

      state.clients = clients;
    },
    UPDATE_ESCROW(state, payload) {
      state.escrowValues = payload;
    },
    UPDATE_ACCOUNT(state, payload) {
      state.account = payload;
    },
    UPDATE_ERROR(state, payload) {
      state.errorMessage = payload;
    },
    UPDATE_TXHASH(state, payload) {
      state.txHash = payload;
    }
  },
  actions: {
    async fetchClients(context) {
      const clientsArray = await getClients();
      context.commit("UPDATE_CLIENTS", clientsArray);
    },
    async fetchEscrowValues(context, client) {
      const values = await getEscrowValues(client);
      values.address = client;
      context.commit('UPDATE_ESCROW', values)
    },
    async fetchValues(context) {
      const clientsArray = await getClients();
      context.commit("UPDATE_CLIENTS", clientsArray);

      const values = await getValues();
      console.log(values);
      context.commit("UPDATE_VALUES", values)

      ethereum.on('accountsChanged', function(accounts) {
        console.log('accounts changed in store.js', accounts);
        context.commit("UPDATE_ACCOUNT", accounts[0]);
      })
    },
    setAccount(context, account) {
      context.commit("UPDATE_ACCOUNT", account);
    },
    setError(context, message) {
      context.commit("UPDATE_ERROR", message);
    },
    setTxHash(context, hash) {
      context.commit("UPDATE_TXHASH", hash);
    }
  },
  getters: {
  },
});